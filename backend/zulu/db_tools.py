import logging

from dynaconf import settings
from pymongo import GEOSPHERE, MongoClient
from pymongo.errors import CollectionInvalid

LOG = logging.getLogger(__name__)

COLLECTIONS = ['users', 'images', 'points']


def db():
    client = MongoClient(settings.MONGO_URI).geo_data
    yield client


def points_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.points

    collection.create_index([("geometry", GEOSPHERE)])
    yield collection


def images_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.images
    yield collection


def users_db():
    client = MongoClient(settings.MONGO_URI).geo_data
    collection = client.users
    yield collection


def init_db():
    client = next(db())
    for collection in COLLECTIONS:
        try:
            client.create_collection(collection)
        except CollectionInvalid:
            LOG.debug(
                f'skipped creating collection {collection} - already exists')
            pass
    points_collection = client.points
    points_collection.create_index([("geometry", GEOSPHERE)])
    LOG.info('Initialize collections successfuly')


def purge_db():
    client = next(db())
    for collection in COLLECTIONS:
        client[collection].delete_many({})
