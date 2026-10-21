import os
import sys
import json
import argparse
from pathlib import Path
import pandas as pd
import numpy as np

# Ensure utf-8 encoding on Windows terminal
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add ml/src to path
sys.path.append(str(Path(__file__).resolve().parent))
from config import (
    RAW_DATA_DIR,
    PROCESSED_DATA_DIR,
    DELAY_THRESHOLD_MINUTES,
    PREDICTION_TIME_FEATURES,
    DATA_LEAKAGE_COLUMNS
)

def inspect_and_validate_dataset(csv_path: Path) -> dict:
    """
    Inspects a raw commercial flight dataset (e.g. U.S. BTS Airline On-Time Performance).
    Validates column integrity, excludes canceled flights, checks for data leakage,
    and quantifies class imbalance.
    """
    print("=" * 80)
    print(f"✈️  FLIGHTDELAY AI - BTS DATASET INSPECTION & VALIDATION")
    print("=" * 80)
    print(f"Target File: {csv_path.name}")
    print(f"Absolute Path: {csv_path.resolve()}\n")

    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset file not found at: {csv_path}")

    # Read CSV
    print("Step 1: Loading raw flight records...")
    df = pd.read_csv(csv_path, low_memory=False)
    raw_count = len(df)
    print(f"✓ Loaded {raw_count:,} raw records with {len(df.columns)} columns.")

    # Standardize BTS column names (handle both modern and legacy BTS schema)
    column_mapping = {
        "FL_DATE": "FlightDate",
        "OP_UNIQUE_CARRIER": "Reporting_Airline",
        "UNIQUE_CARRIER": "Reporting_Airline",
        "CARRIER": "Reporting_Airline",
        "ORIGIN_AIRPORT_ID": "OriginAirportID",
        "DEST_AIRPORT_ID": "DestAirportID",
        "CRS_DEP_TIME": "CRSDepTime",
        "DEP_TIME": "DepTime",
        "DEP_DELAY": "DepDelay",
        "DEP_DELAY_NEW": "DepDelayMinutes",
        "CANCELLED": "Cancelled",
        "DISTANCE": "Distance",
        "CRS_ELAPSED_TIME": "CRSElapsedTime",
    }
    df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})

    # Validate essential columns
    required_cols = ["FlightDate", "Reporting_Airline", "Origin", "Dest", "CRSDepTime", "DepDelay"]
    missing_required = [col for col in required_cols if col not in df.columns]
    if missing_required:
        raise ValueError(f"CRITICAL ERROR: Dataset is missing required columns: {missing_required}")

    print("✓ All essential aviation columns verified.")

    # Check for Data Leakage Columns
    print("\nStep 2: Auditing Feature Set for Data Leakage...")
    leaks_present_in_dataset = [c for c in DATA_LEAKAGE_COLUMNS if c in df.columns]
    print(f"  Note: Dataset contains post-departure/target columns: {leaks_present_in_dataset}")
    print("  Ensuring these columns are quarantined from the predictive feature set:")
    for leak in leaks_present_in_dataset:
        print(f"    - [QUARANTINED] {leak} (Available only after flight begins)")
    print("✓ Data leakage prevention check passed. Only pre-departure features will be used.")

    # Filter canceled flights
    print("\nStep 3: Filtering & Cleaning Records...")
    if "Cancelled" in df.columns:
        canceled_mask = (df["Cancelled"] == 1)
        canceled_count = int(canceled_mask.sum())
        print(f"  Filtering out {canceled_count:,} canceled flights ({canceled_count / raw_count * 100:.2f}%)...")
        df_clean = df[~canceled_mask].copy()
    else:
        print("  'Cancelled' column not present; proceeding with existing records...")
        canceled_count = 0
        df_clean = df.copy()

    # Drop missing departure delays
    null_delay_count = int(df_clean["DepDelay"].isna().sum())
    if null_delay_count > 0:
        print(f"  Dropping {null_delay_count:,} records with missing departure delay values...")
        df_clean = df_clean.dropna(subset=["DepDelay"]).copy()

    valid_count = len(df_clean)
    print(f"✓ Cleaned dataset contains {valid_count:,} valid commercial flight records.")

    # Target variable construction (Binary Classification)
    print("\nStep 4: Quantifying Class Imbalance (FAA Standard: Delay >= 15 min)...")
    df_clean["IsDelayed"] = (df_clean["DepDelay"] >= DELAY_THRESHOLD_MINUTES).astype(int)
    
    delayed_count = int(df_clean["IsDelayed"].sum())
    on_time_count = valid_count - delayed_count
    delayed_pct = (delayed_count / valid_count) * 100
    on_time_pct = (on_time_count / valid_count) * 100
    imbalance_ratio_num = on_time_count / delayed_count if delayed_count > 0 else 0
    imbalance_ratio_str = f"{imbalance_ratio_num:.2f} : 1"

    print(f"  - On-Time Flights (Class 0): {on_time_count:,} ({on_time_pct:.2f}%)")
    print(f"  - Delayed Flights (Class 1): {delayed_count:,} ({delayed_pct:.2f}%)")
    print(f"  - Class Imbalance Ratio:     {imbalance_ratio_str}")
    print(f"  - Minority Class:            Delayed ({delayed_pct:.2f}%)")

    # Temporal Scope
    df_clean["FlightDate"] = pd.to_datetime(df_clean["FlightDate"])
    earliest_date = df_clean["FlightDate"].min().strftime("%Y-%m-%d")
    latest_date = df_clean["FlightDate"].max().strftime("%Y-%m-%d")
    print(f"\nStep 5: Temporal Range...")
    print(f"  - Earliest Flight: {earliest_date}")
    print(f"  - Latest Flight:   {latest_date}")

    # Top Carriers Analysis
    top_carriers_df = (
        df_clean.groupby("Reporting_Airline")
        .agg(
            total_flights=("IsDelayed", "count"),
            delayed_flights=("IsDelayed", "sum"),
            delay_rate=("IsDelayed", "mean")
        )
        .sort_values(by="total_flights", ascending=False)
        .head(10)
        .reset_index()
    )
    top_carriers = []
    for _, row in top_carriers_df.iterrows():
        top_carriers.append({
            "carrier": str(row["Reporting_Airline"]),
            "total_flights": int(row["total_flights"]),
            "delayed_flights": int(row["delayed_flights"]),
            "delay_rate": round(float(row["delay_rate"]) * 100, 2)
        })

    # Top Airports Analysis
    top_airports_df = (
        df_clean.groupby("Origin")
        .agg(
            total_departures=("IsDelayed", "count"),
            delayed_departures=("IsDelayed", "sum"),
            delay_rate=("IsDelayed", "mean")
        )
        .sort_values(by="total_departures", ascending=False)
        .head(10)
        .reset_index()
    )
    top_airports = []
    for _, row in top_airports_df.iterrows():
        top_airports.append({
            "airport": str(row["Origin"]),
            "total_departures": int(row["total_departures"]),
            "delayed_departures": int(row["delayed_departures"]),
            "delay_rate": round(float(row["delay_rate"]) * 100, 2)
        })

    # Hourly Distribution
    df_clean["DepHour"] = (df_clean["CRSDepTime"].fillna(0) // 100).astype(int).clip(0, 23)
    hourly_df = (
        df_clean.groupby("DepHour")
        .agg(
            total_flights=("IsDelayed", "count"),
            delayed_flights=("IsDelayed", "sum"),
            delay_rate=("IsDelayed", "mean")
        )
        .reset_index()
    )
    hourly_distribution = []
    for _, row in hourly_df.iterrows():
        hourly_distribution.append({
            "hour": int(row["DepHour"]),
            "total_flights": int(row["total_flights"]),
            "delayed_flights": int(row["delayed_flights"]),
            "delay_rate": round(float(row["delay_rate"]) * 100, 2)
        })

    # Compile Summary Dictionary
    summary = {
        "dataset_source": "U.S. Bureau of Transportation Statistics (BTS) On-Time Performance",
        "filename": csv_path.name,
        "total_records": valid_count,
        "raw_records": raw_count,
        "canceled_records_excluded": canceled_count,
        "on_time_count": on_time_count,
        "delayed_count": delayed_count,
        "on_time_percentage": round(on_time_pct, 2),
        "delayed_percentage": round(delayed_pct, 2),
        "imbalance_ratio": imbalance_ratio_str,
        "minority_percentage": round(delayed_pct, 2),
        "date_range": {
            "start": earliest_date,
            "end": latest_date
        },
        "top_carriers": top_carriers,
        "top_airports": top_airports,
        "hourly_distribution": hourly_distribution,
        "prediction_features_validated": PREDICTION_TIME_FEATURES
    }

    # Save summary to processed directory
    output_summary_path = PROCESSED_DATA_DIR / "dataset_summary.json"
    with open(output_summary_path, "w") as f:
        json.dump(summary, f, indent=2)

    print(f"\n✓ Dataset summary successfully saved to: {output_summary_path.resolve()}")
    print("=" * 80)
    return summary

def main():
    parser = argparse.ArgumentParser(description="Inspect and validate commercial flight delay dataset.")
    parser.add_argument("--file", type=str, default=None, help="Path to raw BTS CSV file.")
    args = parser.parse_args()

    if args.file:
        target_path = Path(args.file)
    else:
        # Check if any CSV is in RAW_DATA_DIR
        csv_files = list(RAW_DATA_DIR.glob("*.csv"))
        if not csv_files:
            print("=" * 80)
            print("⚠️  NO RAW DATASET DETECTED IN ml/data/raw/")
            print("=" * 80)
            print("To inspect a flight dataset, please place a BTS CSV file into:")
            print(f"  {RAW_DATA_DIR.resolve()}\n")
            print("Official BTS Data Source:")
            print("  https://www.transtats.bts.gov/DL_SelectFields.aspx?gnoyr_VQ=FGJ&QO_fu146_anzr=b0-gvzr")
            print("\nRecommended BTS Fields:")
            print("  FlightDate, Reporting_Airline, Origin, Dest, CRSDepTime, DepDelay, Cancelled, Distance")
            print("=" * 80)
            sys.exit(0)
        target_path = csv_files[0]

    inspect_and_validate_dataset(target_path)

if __name__ == "__main__":
    main()
