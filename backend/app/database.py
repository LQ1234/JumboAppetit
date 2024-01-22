# app/database.py
# Author: Larry Qiu
# Date: 1/22/2023
# Purpose: Define the database connection

from pymongo import MongoClient
client = MongoClient('mongodb://mongo:27017/')
db = client['jumbo-appetit']
