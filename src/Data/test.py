import pandas as pd

input_file = r"C:\Users\chugh\Desktop\Dbms\Food\src\assets\Mumbairestaurants.csv"
output_file = "output.csv"

# Read the CSV file
df = pd.read_csv(input_file, header=0, delimiter="|", skipinitialspace=True)

# Save to CSVcd
df.to_csv(output_file, index=False)
print(df) 