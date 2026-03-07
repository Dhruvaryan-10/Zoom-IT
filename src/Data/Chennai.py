import pandas as pd
import psycopg
from psycopg.rows import dict_row

# === 1. Load CSV ===
file_path = r'C:\Users\Asus\OneDrive\Documents\Desktop\Zoom-it\project\assets\ChennaiRestaurants.csv'

try:
    df = pd.read_csv(file_path)
    print("✅ CSV loaded successfully.")
    print("Original Columns:", df.columns.tolist())
except Exception as e:
    print(f"❌ Error loading CSV: {e}")
    exit()

# === 2. Rename Columns ===
df = df.rename(columns={
    'Zomato URL': 'zomato_url',
    'Name of Restaurant': 'restaurant_name',
    'Address': 'address',
    'Location': 'location',
    'Cuisine': 'cuisine',
    'Top Dishes': 'top_dishes',
    'Price for 2': 'price_for_2',
    'Dining Rating': 'dining_rating',
    'Dining Rating Count': 'dining_rating_count',
    'Delivery Rating': 'delivery_rating',
    'Delivery Rating Count': 'delivery_rating_count',
    'Features': 'features'
})

print("Renamed Columns:", df.columns.tolist())

# === 3. Clean Data ===
df['price_for_2'] = df['price_for_2'].astype(str).str.replace(',', '').str.strip().replace('nan', '0')
df['dining_rating'] = pd.to_numeric(df['dining_rating'], errors='coerce')
df['dining_rating_count'] = pd.to_numeric(df['dining_rating_count'], errors='coerce').fillna(0).astype(int)
df['delivery_rating'] = pd.to_numeric(df['delivery_rating'], errors='coerce')
df['delivery_rating_count'] = pd.to_numeric(df['delivery_rating_count'], errors='coerce').fillna(0).astype(int)
df['features'] = df['features'].astype(str).str.replace('[', '').str.replace(']', '').str.replace("'", '')

# === 4. Insert into PostgreSQL using psycopg3 ===
try:
    with psycopg.connect(
        dbname='zoomit',
        user='postgres',
        password='10October2005',
        host='localhost',
        port='5432'
    ) as conn:
        with conn.cursor() as cur:
            insert_query = """
                INSERT INTO Chennai (
                    zomato_url, restaurant_name, address, location, cuisine,
                    top_dishes, price_for_2, dining_rating, dining_rating_count,
                    delivery_rating, delivery_rating_count, features
                )
                VALUES (%(zomato_url)s, %(restaurant_name)s, %(address)s, %(location)s, %(cuisine)s,
                        %(top_dishes)s, %(price_for_2)s, %(dining_rating)s, %(dining_rating_count)s,
                        %(delivery_rating)s, %(delivery_rating_count)s, %(features)s)
            """
            cur.executemany(insert_query, df.to_dict(orient='records'))
            conn.commit()
            print(f"✅ Successfully inserted {len(df)} rows into 'chennai' table.")

except Exception as e:
    print(f"❌ Database Error: {e}")

finally:
    print("🔒 Database operation completed.")
