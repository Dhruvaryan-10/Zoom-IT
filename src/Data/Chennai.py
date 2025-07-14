import pandas as pd
import psycopg2
from psycopg2.extras import execute_values

# Read the CSV file
file_path = r'C:\Users\chugh\Desktop\Zoom-iT\dbms\assets\chennairestaurants.csv'
df = pd.read_csv(file_path)

print("Original Columns:", df.columns.tolist())

# Rename columns to match PostgreSQL table schema
df = df.rename(columns={
    'Zomato URL': 'zomato_url',
    'Name of Restaurant': 'restaurant_name',
    'Address': 'address',
    'Location': 'location',
    'Cuisine': 'cuisine',
    'Top Dishes': 'top_dishes',
    'Price for 2': 'price_for_2',  # corrected
    'Dining Rating': 'dining_rating',
    'Dining Rating Count': 'dining_rating_count',
    'Delivery Rating': 'delivery_rating',
    'Delivery Rating Count': 'delivery_rating_count',
    'Features': 'features'
})

print("Renamed Columns:", df.columns.tolist())

# Clean and convert data types
df['price_for_2'] = df['price_for_2'].astype(str).str.replace(',', '').str.strip()
df['price_for_2'] = df['price_for_2'].replace('nan', '0')  # handle NaN
df['price_for_2'] = df['price_for_2'].astype(str)

df['dining_rating'] = pd.to_numeric(df['dining_rating'], errors='coerce')
df['dining_rating_count'] = pd.to_numeric(df['dining_rating_count'], errors='coerce').fillna(0).astype(int)
df['delivery_rating'] = pd.to_numeric(df['delivery_rating'], errors='coerce')
df['delivery_rating_count'] = pd.to_numeric(df['delivery_rating_count'], errors='coerce').fillna(0).astype(int)

# Convert features list to comma-separated strings
df['features'] = df['features'].astype(str).str.replace('[', '').str.replace(']', '').str.replace("'", '')

# Connect to PostgreSQL
conn = psycopg2.connect(
    dbname='zoomit',
    user='postgres',
    password='24June1987',
    host='localhost',
    port='5432'
)
cursor = conn.cursor()

# Prepare SQL insert statement
insert_query = """
    INSERT INTO chennai (
        zomato_url, restaurant_name, address, location, cuisine,
        top_dishes, price_for_2, dining_rating, dining_rating_count,
        delivery_rating, delivery_rating_count, features
    ) VALUES %s
"""

# Convert dataframe rows to list of tuples
values = [
    (
        row.zomato_url, row.restaurant_name, row.address, row.location, row.cuisine,
        row.top_dishes, row.price_for_2, row.dining_rating, row.dining_rating_count,
        row.delivery_rating, row.delivery_rating_count, row.features
    )
    for row in df.itertuples(index=False)
]

# Execute batch insert
execute_values(cursor, insert_query, values)
conn.commit()

print("✅ Data inserted into 'chennai' table successfully.")

# Cleanup
cursor.close()
conn.close()
