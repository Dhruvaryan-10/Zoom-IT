import csv
import psycopg
from psycopg_pool import ConnectionPool

# Database connection setup using psycopg v3 and connection pool
try:
    pool = ConnectionPool(
        "dbname=zoomit user=postgres password=10October2005 host=localhost port=5432"
    )
    print("✅ Connected to PostgreSQL successfully (via pool).")
except Exception as e:
    print("❌ Error connecting to PostgreSQL:", e)
    exit()

# Path to your CSV file (raw string prevents escape issues)
csv_path = r'C:\Users\Asus\OneDrive\Desktop\Zoom-it\project\assets\DelhiRestaurants.csv'

# Read CSV and insert into the database
inserted = 0
try:
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            try:
                # Handle missing/empty values cleanly
                values = (
                    row.get('Restaurant_Name', '').strip() or None,
                    row.get('Category', '').strip() or None,
                    row.get('Pricing_for_2', '').strip() or None,
                    row.get('Locality', '').strip() or None,
                    row.get('Dining_Rating', '').strip() or None,
                    row.get('Dining_Review_Count', '').strip() or None,
                    row.get('Delivery_Rating', '').strip() or None,
                    row.get('Delivery_Rating_Count', '').strip() or None,
                    row.get('Website', '').strip() or None,
                    row.get('Address', '').strip() or None,
                    row.get('Phone_No', '').strip() or None,
                    row.get('Latitude', '').strip() or None,
                    row.get('Longitude', '').strip() or None,
                    row.get('Known_For_1', '').strip() or None,
                    row.get('Known_For_2', '').strip() or None
                )

                # Use the connection pool to execute the query
                with pool.connection() as conn:
                    with conn.cursor() as cur:
                        cur.execute("""
                            INSERT INTO delhi (
                                restaurant_name, category, pricing_for_2, locality, dining_rating,
                                dining_review_count, delivery_rating, delivery_rating_count, website,
                                address, phone_no, latitude, longitude, known_for_1, known_for_2
                            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, values)
                        conn.commit()  # commit successful insert

                inserted += 1

            except Exception as insert_error:
                print(f"⚠️ Skipped a row due to error: {insert_error}")

    print(f"✅ Delhi data inserted successfully — {inserted} rows added.")

except FileNotFoundError:
    print(f"❌ CSV file not found at: {csv_path}")

except Exception as e:
    print(f"❌ Error processing CSV: {e}")

finally:
    pool.close()
    print("🔒 Database connection pool closed.")
