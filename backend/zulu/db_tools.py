from dynaconf import settings
from pymongo import GEOSPHERE, MongoClient

 # a user references a story which references a point
def points_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points
    collection.create_index([("location", GEOSPHERE)])
    yield collection
def story_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.stories
    yield collection
def user_db():
    client = MongoClient(settings.MONGO_URI).users_data
    collection = client.stories
    yield collection
def init_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points
    collection.create_index([("location", GEOSPHERE)])
    return collection
