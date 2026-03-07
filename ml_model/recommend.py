# recommend.py

import os
import pandas as pd
import joblib
import numpy as np

# Set up paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "user_recommendation_model.pkl")
user_pref_path = os.path.join(BASE_DIR, "user_pref_matrix.csv")
restaurants_path = os.path.join(BASE_DIR, "data", "restaurants.csv")

# Load trained model and data
model = joblib.load(model_path)
user_pref = pd.read_csv(user_pref_path, index_col=0)
restaurants = pd.read_csv(restaurants_path)

def recommend_restaurants(user_id, top_n=5):
    """
    Recommend restaurants for a given user based on similar users' preferences.
    """
    if user_id not in user_pref.index:
        return "⚠️ User not found in training data. Try a new user_id."

    # Get the user vector
    user_vector = user_pref.loc[[user_id]].values

    # Find similar users
    distances, indices = model.kneighbors(user_vector, n_neighbors=6)
    similar_users = user_pref.index[indices.flatten()[1:]]  # Skip the user itself

    # Average the ratings of similar users
    similar_user_prefs = user_pref.loc[similar_users]
    avg_preferences = similar_user_prefs.mean().sort_values(ascending=False)

    # Pick top cuisines
    top_cuisines = avg_preferences.head(3).index.tolist()

    # Filter restaurants that match top cuisines
    rec_restaurants = restaurants[restaurants['Category'].str.contains('|'.join(top_cuisines), case=False, na=False)]
    rec_restaurants = rec_restaurants.sample(n=min(top_n, len(rec_restaurants)))

    return {
        "user_id": user_id,
        "recommended_cuisines": top_cuisines,
        "recommended_restaurants": rec_restaurants[['Restaurant_Name', 'Category', 'Locality', 'Dining_Rating', 'Website']]
    }

# Test the function
if __name__ == "__main__":
    test_user = user_pref.index[0]  # Pick the first user from the dataset
    result = recommend_restaurants(test_user)
    print("\n✅ Recommended Cuisines:", result["recommended_cuisines"])
    print("\n🍴 Recommended Restaurants:\n", result["recommended_restaurants"])
