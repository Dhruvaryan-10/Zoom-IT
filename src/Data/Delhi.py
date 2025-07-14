import pymysql
import pandas as pd
import numpy as np


file_path = r"C:\Users\chugh\Desktop\Dbms\Food\src\assets\DelhiRestaurants.csv"


df = pd.read_csv(file_path)


df = df.replace({np.nan: None})


def clean_phone_number(phone):
    if isinstance(phone, str):  
        return phone[:20]  
    return None

df["Phone_No"] = df["Phone_No"].astype(str).apply(clean_phone_number)


conn = pymysql.connect(host="localhost", user="root", password="24June1987", database="dbms")
cursor = conn.cursor()


for _, row in df.iterrows():
    sql = """INSERT INTO Restaurants 
        (name, category, pricing_for_2, locality, dining_rating, dining_review_count, 
         delivery_rating, delivery_review_count, website, address, phone_no, 
         latitude, longitude, known_for) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
    
    values = (
        row["Restaurant_Name"], row["Category"], row["Pricing_for_2"], row["Locality"],
        row["Dining_Rating"], row["Dining_Review_Count"], row["Delivery_Rating"], 
        row["Delivery_Rating_Count"], row["Website"], row["Address"], row["Phone_No"],
        row["Latitude"], row["Longitude"], row["Known_For2"]
    )

    cursor.execute(sql, values)

conn.commit()
cursor.close()
conn.close()
