import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# Load the CSV file
file_path = r'C:\Users\chugh\Desktop\Zoom-iT\dbms\assets\kolkatarestaurants.csv'  # Adjust if needed
df = pd.read_csv(file_path)

print("Original Columns:", df.columns.tolist())

# Rename CSV columns to match your PostgreSQL table
df = df.rename(columns={
    'name': 'name',
    'voteCount': 'vote_count',
    'rating': 'rating',
    'address': 'address',
    'cusine': 'cuisine',         # fixing spelling from 'cusine' to 'cuisine'
    'cost': 'cost',
    'timing': 'timing'
})

print("Renamed Columns:", df.columns.tolist())

# Convert and clean data
df['vote_count'] = pd.to_numeric(df['vote_count'], errors='coerce').fillna(0).astype(int)
df['rating'] = pd.to_numeric(df['rating'], errors='coerce').round(2)
df['cost'] = df['cost'].astype(str).str.replace(',', '').str.strip()
df['timing'] = df['timing'].fillna('').astype(str)

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname='zoomit',
    user='postgres',
    password='24June1987',
    host='localhost',
    port='5432'
)
cursor = conn.cursor()

# SQL insert
insert_query = """
    INSERT INTO kolkata (
        name, vote_count, rating, address, cuisine, cost, timing
    ) VALUES %s
"""

# Create tuples for insert
values = [
    (
        row.name, row.vote_count, row.rating, row.address,
        row.cuisine, row.cost, row.timing
    )
    for row in df.itertuples(index=False)
]

# Execute batch insert
execute_values(cursor, insert_query, values)
conn.commit()

print("✅ Kolkata data inserted successfully.")

cursor.close()
conn.close()
