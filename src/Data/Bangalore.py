import pandas as pd
import psycopg2
from psycopg2 import sql

# Load the entire CSV without limiting the number of rows
csv_file = r'C:\Users\chugh\Desktop\Zoom-iT\dbms\assets\Bengalorerestaurants.csv'
df_full = pd.read_csv(csv_file, delimiter=',', encoding='latin1')

# Rename columns to match DB field names
df_full = df_full.rename(columns={
    'listed_in(type)': 'listed_in_type',
    'listed_in(city)': 'listed_in_city'
})

# Connect to PostgreSQL
try:
    conn = psycopg2.connect(
        host="localhost",
        database="zoomit",
        user="postgres",
        password="24June1987"  # 🔐 Replace with your actual password if needed
    )
    cursor = conn.cursor()
    print("✅ Connected to PostgreSQL")

    # Create the table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bangalore (
            id SERIAL PRIMARY KEY,
            url TEXT,
            address TEXT,
            name TEXT,
            online_order TEXT,
            book_table TEXT,
            rate TEXT,
            votes TEXT,
            phone TEXT,
            location TEXT,
            rest_type TEXT,
            dish_liked TEXT,
            cuisines TEXT,
            approx_cost TEXT,
            reviews_list TEXT,
            menu_item TEXT,
            listed_in_type TEXT,
            listed_in_city TEXT
        );
    ''')
    conn.commit()
    print("✅ Table 'bangalore' is ready")

    # Insert each row safely
    for index, row in df_full.iterrows():
        try:
            cursor.execute('''
                INSERT INTO bangalore (
                    url, address, name, online_order, book_table, rate, votes, phone,
                    location, rest_type, dish_liked, cuisines, approx_cost,
                    reviews_list, menu_item, listed_in_type, listed_in_city
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                str(row.get('url', '')).strip(),
                str(row.get('address', '')).strip(),
                str(row.get('name', '')).strip(),
                str(row.get('online_order', '')).strip(),
                str(row.get('book_table', '')).strip(),
                str(row.get('rate', '')).strip(),
                str(row.get('votes', '')).strip(),
                str(row.get('phone', '')).strip(),
                str(row.get('location', '')).strip(),
                str(row.get('rest_type', '')).strip(),
                str(row.get('dish_liked', '')).strip(),
                str(row.get('cuisines', '')).strip(),
                str(row.get('approx_cost', '')).strip(),
                str(row.get('reviews_list', '')).strip(),
                str(row.get('menu_item', '')).strip(),
                str(row.get('listed_in_type', '')).strip(),
                str(row.get('listed_in_city', '')).strip()
            ))
        except Exception as row_err:
            print(f"⚠️ Skipped row {index + 1} due to error: {row_err}")

    conn.commit()
    print(f"✅ Successfully inserted {len(df_full)} records into 'bangalore' table")

except Exception as e:
    print("❌ Error:", e)

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
        print("🔒 Connection closed")
