# project/backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # 🔥 allow frontend (React) to access Flask APIs

# Example: Recommendation route
@app.route("/recommend", methods=["GET"])
def recommend():
    user_id = int(request.args.get("user_id", 1))
    model = joblib.load("../ml_model/user_recommendation_model.pkl")
    user_pref = pd.read_csv("../ml_model/user_pref_matrix.csv", index_col=0)
    
    if user_id not in user_pref.index:
        return jsonify({"error": "User not found"})

    # Mock recommendation output
    cuisines = ["North Indian", "South Indian", "Cafe"]
    restaurants = [
        {"name": "Gulati", "rating": 4.7, "area": "Pandara Road"},
        {"name": "Cafe Lota", "rating": 4.9, "area": "Pragati Maidan"},
    ]
    
    return jsonify({"cuisines": cuisines, "restaurants": restaurants})

# Example: Map route
@app.route("/map", methods=["GET"])
def map():
    pincode = request.args.get("pincode", "110001")
    map_path = f"../ml_model/map_{pincode}.html"
    return jsonify({"map_url": f"http://127.0.0.1:5000/static/{map_path}"})

if __name__ == "__main__":
    app.run(debug=True)
