from dynaconf import settings
from pymongo import GEOSPHERE, MongoClient


def points_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points

    collection.create_index([("geometry", GEOSPHERE)])
    yield collection


def images_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.images
    yield collection


def init_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    point_collection = client.points
    point_collection.create_index([("geometry", GEOSPHERE)])

    images_collection = client.images
    return point_collection, images_collection
