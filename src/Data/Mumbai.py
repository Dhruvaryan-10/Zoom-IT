import pymysql
import pandas as pd
import numpy as np


file_path = r"C:\Users\chugh\Desktop\Dbms\Food\src\assets\mumbairestaurants.csv"


try:
    df = pd.read_csv(file_path, encoding="utf-8", delimiter="|", skiprows=1, on_bad_lines="skip")
    print("✅ CSV file loaded successfully!")
except Exception as e:
    print("❌ Error reading CSV file:", e)
    exit()


print("🔍 CSV Columns Found:", df.columns)


expected_columns = ["NAME", "PRICE", "CUSINE_CATEGORY", "CITY", "REGION",
                    "URL", "RATING_TYPE", "RATING", "VOTES"]

df = df[expected_columns]  


df.columns = ["name", "pricing_for_2", "cuisine_category", "city", "region", 
              "url", "rating_type", "rating", "votes"]


df["pricing_for_2"] = pd.to_numeric(df["pricing_for_2"], errors="coerce")
df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
df["votes"] = pd.to_numeric(df["votes"], errors="coerce")


df.replace({"NEW": None, "N/A": None, "NA": None}, inplace=True)


df = df.where(pd.notna(df), None)


print("🔍 First 3 Rows to Insert:", df.head(3).values.tolist())

# ✅ Connect to MySQL
try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="24June1987",  
        database="dbms"
    )
    cursor = conn.cursor()
    print("✅ Connected to MySQL successfully!")

    
    sql = """INSERT INTO mumbai 
        (name, pricing_for_2, cuisine_category, city, region, url, rating_type, rating, votes) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"""

    
    data_to_insert = [
        (
            row["name"], row["pricing_for_2"], row["cuisine_category"], row["city"],
            row["region"], row["url"], row["rating_type"], row["rating"], row["votes"]
        )
        for _, row in df.iterrows()
    ]

    
    try:
        cursor.executemany(sql, data_to_insert)
        conn.commit()
        print("✅ Data inserted successfully!")
    except Exception as e:
        print("❌ Error inserting data:", e)
        conn.rollback()  

except pymysql.MySQLError as db_error:
    print("❌ Database Error:", db_error)

finally:
   
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()

    print("🔒 MySQL connection closed.")
