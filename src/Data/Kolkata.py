import pandas as pd
import psycopg
from psycopg.rows import tuple_row
from psycopg_pool import ConnectionPool

# === CSV File Path ===
file_path = r'C:\Users\Asus\OneDrive\Documents\Desktop\Zoom-it\project\assets\kolkatarestaurants.csv'

# === Step 1: Load CSV ===
try:
    df = pd.read_csv(file_path)
    print("✅ CSV loaded successfully.")
    print("Original Columns:", df.columns.tolist())
except FileNotFoundError:
    print(f"❌ CSV file not found at: {file_path}")
    exit()
except Exception as e:
    print(f"❌ Error reading CSV: {e}")
    exit()

# === Step 2: Rename columns (match your CSV) ===
df = df.rename(columns={
    'name': 'name',
    'voteCount': 'vote_count',
    'rating': 'rating',
    'address': 'address',
    'cusine': 'cuisine',  # fix spelling
    'cost': 'cost',
    'timing': 'timing'
})
print("Renamed Columns:", df.columns.tolist())

# === Step 3: Clean and convert data types ===
df['vote_count'] = pd.to_numeric(df['vote_count'], errors='coerce').fillna(0).astype(int)
df['rating'] = pd.to_numeric(df['rating'], errors='coerce').round(2)
df['cost'] = df['cost'].astype(str).str.replace(',', '').str.strip()
df['timing'] = df['timing'].fillna('').astype(str)

# === Step 4: Database connection pool ===
try:
    pool = ConnectionPool(
        "dbname=zoomit user=postgres password=10October2005 host=localhost port=5432"
    )
    print("✅ Connected to PostgreSQL successfully (via pool).")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    exit()

# === Step 5: Prepare SQL ===
insert_query = """
    INSERT INTO kolkata (
        name, vote_count, rating, address, cuisine, cost, timing
    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

# === Step 6: Convert DataFrame to list of tuples ===
values = [
    (
        row.name,
        row.vote_count,
        row.rating,
        row.address,
        row.cuisine,
        row.cost,
        row.timing
    )
    for row in df.itertuples(index=False)
]

# === Step 7: Batch insert ===
try:
    with pool.connection() as conn:
        with conn.cursor(row_factory=tuple_row) as cur:
            cur.executemany(insert_query, values)
            conn.commit()
    print(f"✅ Kolkata data inserted successfully — {len(values)} rows added.")
except Exception as e:
    print(f"❌ Error inserting data: {e}")

# === Step 8: Close connection pool ===
pool.close()
print("🔒 Database connection pool closed.")
