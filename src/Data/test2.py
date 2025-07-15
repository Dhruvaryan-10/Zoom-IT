import pandas as pd
import psycopg2

# === File Path ===
csv_file = r'C:\Users\chugh\Desktop\Zoom-iT\dbms\assets\Bengalorerestaurants.csv'

# === Step 1: Load Data ===
try:
    df = pd.read_csv(csv_file, delimiter=',', encoding='latin1', low_memory=False)
    print("✅ CSV file loaded")
except Exception as e:
    print(f"❌ Failed to read CSV: {e}")
    exit()

# === Step 2: Clean Column Names ===
df.columns = df.columns.str.strip()  # remove whitespace or \n from column names

# === Step 3: Rename Columns to Match PostgreSQL Field Names ===
df.rename(columns={
    'listed_in(type)': 'listed_in_type',
    'listed_in(city)': 'listed_in_city',
    'approx_cost(for two people)': 'approx_cost'  # Adjust this based on actual CSV column name
}, inplace=True)

# === Step 4: Filter and Clean Data ===
try:
    df_clean = df[
        df['name'].notna() &
        df['address'].notna() &
        df['location'].notna() &
        ~df['name'].astype(str).str.contains("Ã", na=False) &
        ~df['address'].astype(str).str.contains("Ã", na=False) &
        ~df['reviews_list'].astype(str).str.contains("Ã", na=False) &
        df['rate'].astype(str).str.match(r'^[0-9.]+/?5?$', na=False) &
        df['approx_cost'].astype(str).str.match(r'^[0-9,]+$', na=False) &
        df['name'].astype(str).str.len() < 100
    ]
    df_clean = df_clean.head(15000)
    print("✅ Data cleaned and filtered")
except Exception as filter_err:
    print(f"❌ Error during filtering: {filter_err}")
    exit()

# === Step 5: PostgreSQL Connection ===
try:
    conn = psycopg2.connect(
        host="localhost",
        database="zoomit",
        user="postgres",
        password="24June1987"  # Replace this with a secure password in production
    )
    cursor = conn.cursor()
    print("✅ Connected to PostgreSQL")

    # === Step 6: Create 'bangalore' Table ===
    cursor.execute('''
        DROP TABLE IF EXISTS bangalore;
        CREATE TABLE bangalore (
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
    print("✅ Table 'bangalore' created")

    # === Step 7: Insert Data ===
    success_count = 0
    for index, row in df_clean.iterrows():
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
            success_count += 1
        except Exception as row_err:
            print(f"⚠️ Row {index + 1} skipped: {row_err}")

    conn.commit()
    print(f"✅ Inserted {success_count} records into 'bangalore' table")

except Exception as e:
    print(f"❌ Database error: {e}")

finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
        print("🔒 Connection closed")
