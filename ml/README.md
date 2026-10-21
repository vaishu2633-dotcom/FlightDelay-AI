# Machine Learning Research Pipeline: FlightDelay AI

## Research Focus
Class Imbalance in Commercial Flight Delay Prediction: Evaluation and Mitigation Techniques.

## Binary Classification Setup
- **Class 0 (Majority, ~80%):** On-Time or minor departure delay ($< 15$ minutes).
- **Class 1 (Minority, ~20%):** Delayed flight ($\text{DepDelay} \ge 15$ minutes).
- **Canceled Flights:** Excluded from the binary dataset (`Cancelled == 0`).

## Pre-Departure Features (No Data Leakage)
Only variables known prior to departure are permitted into the feature pipeline:
- `Month` (1–12)
- `DayOfWeek` (1–7)
- `CRSDepTime` / `DepHour` (Scheduled departure hour, 0–23)
- `Reporting_Airline` (Operating carrier code)
- `Origin` (Origin airport IATA code)
- `Dest` (Destination airport IATA code)
- `Distance` (Flight distance in miles)

## Mitigation Techniques Compared
1. **Baseline Logistic Regression** (No resampling)
2. **Baseline Random Forest** (No resampling)
3. **Random Undersampling (RUS)** + Random Forest
4. **Random Oversampling (ROS)** + Random Forest
5. **SMOTE** + Random Forest
6. **Cost-Sensitive Class Weighting** (`class_weight='balanced'`)
7. **Balanced Random Forest Classifier** (Balanced bootstrap sampling)

## Dataset Acquisition (U.S. BTS)
Raw data can be downloaded from:
- [BTS TranStats On-Time Performance](https://www.transtats.bts.gov/DL_SelectFields.aspx?gnoyr_VQ=FGJ&QO_fu146_anzr=b0-gvzr)
- Place downloaded CSV files into `ml/data/raw/`
- Run `python ml/src/inspect_dataset.py` to validate columns and calculate class distributions.
