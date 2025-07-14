from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

# Correct relative path to the CSV
df = pd.read_csv("assets/DelhiRestaurants.csv")

@app.route("/api/filter", methods=["POST"])
def filter_restaurants():
    data = request.get_json()
    filter_type = data.get("filter")

    filtered_df = df.copy()

    if filter_type == "highest":
        filtered_df = filtered_df.sort_values(by="rating", ascending=False)
    elif filter_type == "lowest":
        filtered_df = filtered_df.sort_values(by="rating", ascending=True)
    elif filter_type == "most_expensive":
        filtered_df = filtered_df.sort_values(by="price", ascending=False)
    elif filter_type == "most_affordable":
        filtered_df = filtered_df.sort_values(by="price", ascending=True)
    elif filter_type == "nearest":
        # You can implement actual geolocation filtering here later
        filtered_df = filtered_df.sample(frac=1)
    elif filter_type.startswith("cuisine_"):
        cuisine = filter_type.split("_", 1)[1]
        filtered_df = filtered_df[filtered_df["cuisine_type"].str.lower() == cuisine.lower()]

    # Limit the results for performance
    result = filtered_df.head(50).to_dict(orient="records")
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
