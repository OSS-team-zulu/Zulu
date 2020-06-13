from dynaconf import settings
from pymongo import GEOSPHERE, MongoClient


def points_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points

    collection.create_index([("geometry", GEOSPHERE)])
    yield collection


def init_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points
    collection.create_index([("geometry", GEOSPHERE)])
    return collection
