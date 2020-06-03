from dynaconf import settings
from pymongo import GEOSPHERE, MongoClient
import json
 # a user references a story which references a point
def points_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points
    collection.create_index([("location", GEOSPHERE)])
    yield collection

def user_db():
    client = MongoClient(settings.MONGO_URI).user_db
    collection = client.users
    yield collection

def init_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points
    collection.create_index([("location", GEOSPHERE)])
    return collection
