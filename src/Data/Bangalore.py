import pandas as pd
import psycopg
from psycopg.rows import dict_row

# --- 1. Load CSV ---
csv_file = r'C:\Users\Asus\OneDrive\Documents\Desktop\Zoom-it\project\assets\BangaloreRestaurants.csv'
df = pd.read_csv(csv_file, delimiter=',', encoding='latin1')
print(f"✅ Loaded {len(df)} rows from CSV")

# --- 2. Rename columns ---
df = df.rename(columns={
    'listed_in(type)': 'listed_in_type',
    'listed_in(city)': 'listed_in_city'
})

# --- 3. Strip whitespace ---
for col in df.select_dtypes(include='object').columns:
    df[col] = df[col].map(lambda x: str(x).strip() if pd.notnull(x) else None)

# --- 4. Fill missing optional columns safely ---
optional_cols = ['approx_cost', 'reviews_list', 'menu_item', 'dish_liked', 'rate', 'votes', 'phone']
for col in optional_cols:
    if col in df.columns:
        df[col] = df[col].where(pd.notna(df[col]), None)

# --- 4a. Keep only the first 20,000 rows ---
df = df.head(20000)
print(f"✅ Preparing to insert {len(df)} rows into the database")

# --- 5. Connect to PostgreSQL ---
try:
    with psycopg.connect(
        host="localhost",
        dbname="zoomit",
        user="postgres",
        password="10October2005",
        autocommit=True
    ) as conn:
        with conn.cursor(row_factory=dict_row) as cursor:
            print("✅ Connected to PostgreSQL")

            # --- 6. Create table ---
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
            print("✅ Table 'bangalore' is ready")

            # --- 7. Prepare insert query ---
            insert_query = '''
                INSERT INTO bangalore (
                    url, address, name, online_order, book_table, rate, votes, phone,
                    location, rest_type, dish_liked, cuisines, approx_cost,
                    reviews_list, menu_item, listed_in_type, listed_in_city
                )
                VALUES (
                    %(url)s, %(address)s, %(name)s, %(online_order)s, %(book_table)s,
                    %(rate)s, %(votes)s, %(phone)s, %(location)s, %(rest_type)s,
                    %(dish_liked)s, %(cuisines)s, %(approx_cost)s,
                    %(reviews_list)s, %(menu_item)s, %(listed_in_type)s, %(listed_in_city)s
                )
            '''

            # --- 8. Insert rows ---
            insert_columns = [
                'url', 'address', 'name', 'online_order', 'book_table', 'rate', 'votes', 'phone',
                'location', 'rest_type', 'dish_liked', 'cuisines', 'approx_cost',
                'reviews_list', 'menu_item', 'listed_in_type', 'listed_in_city'
            ]

            inserted_count = 0
            for row in df.to_dict(orient='records'):
                # Ensure all keys exist
                for col in insert_columns:
                    if col not in row or row[col] is None or str(row[col]).strip() == '':
                        row[col] = None  # psycopg will insert NULL
                try:
                    cursor.execute(insert_query, row)
                    inserted_count += 1
                except Exception as e:
                    print(f"⚠️ Skipped row due to error: {e}")

            print(f"✅ Successfully inserted {inserted_count} records into 'bangalore' table")

except Exception as e:
    print(f"❌ Database Error: {e}")

finally:
    print("🔒 Database operation completed")
