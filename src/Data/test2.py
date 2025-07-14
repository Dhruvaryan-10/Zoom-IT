import pymysql
import pandas as pd
import numpy as np

# File path for the CSV
file_path = r"C:\Users\chugh\Desktop\Zoom-iT\dbms\src\assets\DelhiRestaurants.csv"

# Read the CSV data into a pandas DataFrame
df = pd.read_csv(file_path)

# Print columns to check for any discrepancies
print("Columns in DataFrame:", df.columns)

# Clean any leading or trailing spaces in column names
df.columns = df.columns.str.strip()

# Replace NaN values with None for all numeric columns
df = df.apply(lambda x: x.where(pd.notnull(x), None) if x.dtype.kind in 'fi' else x)

# Handle NaN in non-numeric columns
df['Restaurant_Name'] = df['Restaurant_Name'].fillna('')  # Correct column name 'Restaurant_Name'
df['Category'] = df['Category'].fillna('')

# Mapping categories to menu_template_id
category_to_id = {
    "North Indian": 1,
    "Chinese": 2,
    "Italian": 3,
    "Fast Food": 4,
    "Mexican": 5,
    "Continental": 6
}

# Add menu_template_id column based on the category
df["menu_template_id"] = df["Category"].map(category_to_id)

# Database connection
conn = pymysql.connect(host="localhost", user="root", password="24June1987", database="dbms")
cursor = conn.cursor()

# Loop through each row and update the menu_template_id in the Restaurants table
for _, row in df.iterrows():
    # Replace NaN values with None for SQL compatibility
    values = (
        row['menu_template_id'],  # menu_template_id
        row['Restaurant_Name'],    # Restaurant_Name (correct column)
        row['Category']            # category
    )

    # Ensure the SQL query has the right placeholders (%s)
    sql = """UPDATE Restaurants 
             SET menu_template_id = %s 
             WHERE name = %s AND category = %s"""  # Corrected column 'name' to 'Restaurant_Name'
    
    try:
        cursor.execute(sql, values)
    except pymysql.MySQLError as e:
        print(f"Error executing SQL for row {row['Restaurant_Name']}: {e}")
        continue

# Commit the transaction and close the cursor and connection
conn.commit()
cursor.close()
conn.close()

print("menu_template_id values updated successfully.")
