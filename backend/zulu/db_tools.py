from dynaconf import settings
from pymongo import GEOSPHERE, MongoClient


def points_db() -> None:
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points

    collection.create_index([("location", GEOSPHERE)])
    yield collection


def init_db() -> None:
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points
    collection.create_index([("location", GEOSPHERE)])
    return collection
