/**
 * API Service for FlightDelay AI Backend.
 * Communicates with FastAPI server (default: http://127.0.0.1:8000).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export async function fetchModelStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/model-status`);
    if (!res.ok) throw new Error(`Model status check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return {
      is_trained: false,
      status_message: 'Cannot reach backend service.',
      error: err.message
    };
  }
}

export async function fetchDatasetSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/dataset-summary`);
    if (!res.ok) throw new Error(`Dataset summary request failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return {
      dataset_found: false,
      message: 'Failed to communicate with analytics backend.',
      error: err.message
    };
  }
}

export async function fetchModelComparison() {
  try {
    const res = await fetch(`${API_BASE_URL}/model-comparison`);
    if (!res.ok) throw new Error(`Model comparison request failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return {
      experiments_available: false,
      message: 'Failed to fetch benchmark experiments.',
      error: err.message
    };
  }
}

export async function predictFlight(flightData) {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flightData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || `Prediction error: ${res.statusText}`);
  }
  return data;
}
