# Convert.py
# Author: Aidan Kirk
# Date: 9/28/22
# Description: A tool for converting a csv file into specified
# JSON format for my capstone project

import csv 
import json
import time

def csv_to_json(csv_path, json_path):
    jsonArray = []
      
    #read csv file
    with open(csv_path, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 

        #convert each csv row into python dict
        for row in csvReader: 
            #add this python dict to json array
            jsonArray.append(row)
  
    #convert python jsonArray to JSON String and write to file
    with open(json_path, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
          
csv_path = r'elliptic_txs_edgelist.csv'
json_path = r'elliptic_txs_edgelist.json'

start = time.perf_counter()
csv_to_json(csv_path, json_path)
finish = time.perf_counter()

print("Conversion successfully completed")
