# train_model.py

import os
import pandas as pd
from sklearn.neighbors import NearestNeighbors
import joblib

# Get the directory of this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build full paths dynamically
restaurants_path = os.path.join(BASE_DIR, "data", "restaurants.csv")
orders_path = os.path.join(BASE_DIR, "data", "orders.csv")

# Load datasets
restaurants = pd.read_csv(restaurants_path)
orders = pd.read_csv(orders_path)

# Create a user preference profile (average rating per cuisine)
user_pref = orders.groupby(['user_id', 'cuisine'])['rating_given'].mean().reset_index()
user_pref = user_pref.pivot(index='user_id', columns='cuisine', values='rating_given').fillna(0)

# Collaborative Filtering Model
model = NearestNeighbors(metric='cosine', algorithm='brute')
model.fit(user_pref.values)

# Save user preference matrix and model
joblib.dump(model, os.path.join(BASE_DIR, 'user_recommendation_model.pkl'))
user_pref.to_csv(os.path.join(BASE_DIR, 'user_pref_matrix.csv'), index=True)

print("✅ Recommendation model trained and saved successfully!")
