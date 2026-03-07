# restaurant_map.py

import os
import pandas as pd
import folium
from geopy.geocoders import Nominatim

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
restaurants_path = os.path.join(BASE_DIR, "data", "restaurants.csv")

# Load restaurant data
restaurants = pd.read_csv(restaurants_path)

def show_nearby_restaurants(pincode, top_n=10):
    """
    Show a map with restaurants near the given pincode.
    """
    # Initialize geolocator
    geolocator = Nominatim(user_agent="zoomit_locator")
    location = geolocator.geocode({"postalcode": pincode, "country": "India"})

    if not location:
        print(f"❌ Could not find location for pincode {pincode}.")
        return None

    user_lat, user_lon = location.latitude, location.longitude

    # Filter restaurants that match the pincode (if available)
    nearby_restaurants = restaurants[
        restaurants["Address"].str.contains(str(pincode), case=False, na=False)
    ]

    # If few matches, use all and show the closest ones
    if nearby_restaurants.empty:
        print(f"⚠️ No direct matches for pincode {pincode}, showing random sample.")
        nearby_restaurants = restaurants.sample(min(top_n, len(restaurants)))

    # Create map
    m = folium.Map(location=[user_lat, user_lon], zoom_start=13)
    folium.Marker([user_lat, user_lon], popup="🏠 You", icon=folium.Icon(color="red")).add_to(m)

    # Add restaurants to map
    for _, row in nearby_restaurants.head(top_n).iterrows():
        folium.Marker(
            location=[row["Latitude"], row["Longitude"]],
            popup=f"{row['Restaurant_Name']} ({row['Category']}) - {row['Dining_Rating']}/5",
            icon=folium.Icon(color="green", icon="cutlery", prefix="fa")
        ).add_to(m)

    # Save and show
    output_path = os.path.join(BASE_DIR, f"map_{pincode}.html")
    m.save(output_path)
    print(f"✅ Map saved successfully: {output_path}")
    return output_path

# Test run
if __name__ == "__main__":
    test_pincode = "110001"  # Connaught Place area
    show_nearby_restaurants(test_pincode)
