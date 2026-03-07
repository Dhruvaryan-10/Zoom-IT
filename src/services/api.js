// src/api.js
const BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend URL

export async function getPrediction(pincode) {
  const response = await fetch(`${BASE_URL}/predict?pincode=${pincode}`);
  const data = await response.json();
  return data;
}
