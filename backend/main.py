from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Enable CORS so frontend can access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/recommendations")
def get_recommendations():
    # Simulated data (replace with ML logic later)
    sample_restaurants = [
        {"name": "Delhi Spice Hub", "cuisine": "North Indian"},
        {"name": "Café Latte", "cuisine": "Cafe"},
        {"name": "Masala Street", "cuisine": "South Indian"},
        {"name": "Punjabi Zaika", "cuisine": "Punjabi"},
        {"name": "Hakka Tales", "cuisine": "Chinese"},
    ]
    return {"recommendations": random.sample(sample_restaurants, 3)}
