import pytest
from fastapi import status
from fastapi.testclient import TestClient
from bson.objectid import ObjectId
from bson.errors import InvalidId
import io
import os

from zulu import db_tools
from zulu.server import app


BASE_TESTS_DIR = os.path.join('tests')


@pytest.fixture
def client():
    yield TestClient(app)


@pytest.fixture
def db():
    yield next(db_tools.points_db())


@pytest.fixture
def test_data():
    return [{
        "geometry": {
            "type": "Point",
            "coordinates": [34.8562505, 32.1423376],
        },
        "user_id": "Tel Aviv",
        "story": {
            'content': 'Tel Aviv',
            'title': 'TEL AVIV'
        },
    }, {
        "geometry": {
            "type": "Point",
            "coordinates": [35.23702, 31.790886, 0],
        },
        "user_id": "Jerusalem",
        "story": {
            'content': 'JERUSALEM',
            'title': 'JERUSALEM'
        },
    }, {
        "geometry": {
            "type": "Point",
            "coordinates": [-74.071789, 40.6409],
        },
        "user_id": "New York",
        "story": {
            'content': 'NEW YORK',
            'title': 'New York'
        },
    }]


@pytest.fixture
def more_data():
    return [{
        "geometry": {
            "type": "Point",
            "coordinates": [34.8592505, 32.1473376],
        },
        "user_id": "near Tel Aviv",
        "story": {
            'content': 'near Tel Aviv',
            'title': ' near TEL AVIV'
        },
    }, {
        "geometry": {
            "type": "Point",
            "coordinates": [35.23402, 31.793886, 0],
        },
        "user_id": "near Jerusalem",
        "story": {
            'content': 'near JERUSALEM',
            'title': 'near JERUSALEM'
        }
    }]


@pytest.fixture
def db_data(db, test_data):
    db.delete_many({})
    db.insert_many(test_data)


def test_get_points_basic(client):
    response = client.get("/api/point")
    assert response.status_code == 200


@pytest.mark.parametrize("user_id", ["Jerusalem", "New York", "Tel Aviv"])
def test_get_points_one_result(db_data, test_data, client, user_id):
    coordinates = [
        entry["geometry"]["coordinates"] for entry in test_data
        if entry["user_id"] == user_id
    ].pop()
    response = client.get("/api/point",
                          params={
                              "longitude": coordinates[0],
                              "latitude": coordinates[1],
                              "max_distance": 20,
                          })
    response.raise_for_status()
    result = response.json()
    assert len(result) == 1
    assert result[0]['user_id'] == user_id


def test_create_point_basic(test_data, client):
    jerusalem = [data for data in test_data
                 if data['user_id'] == 'Jerusalem'].pop()

    data = {
        'longitude': jerusalem['geometry']['coordinates'][0],
        'latitude': jerusalem['geometry']['coordinates'][1],
        'user_id': 'Jerusalem',
        'story': {
            'content': 'JERUSALEM',
            'title': 'jerusalem'
        }
    }
    response = client.post('/api/point', json=data)
    response.raise_for_status()
    assert response.status_code == status.HTTP_201_CREATED


def test_get_points_two_results(db_data, test_data, client):
    coordinates = [
        entry["geometry"]["coordinates"] for entry in test_data
        if entry["user_id"] == "Jerusalem"
    ].pop()
    response = client.get("/api/point",
                          params={
                              "longitude": coordinates[0],
                              "latitude": coordinates[1],
                              "max_distance": 150000
                          })
    response.raise_for_status()
    result = response.json()
    assert len(result) == 2
    users = sorted([entry["user_id"] for entry in result])
    assert users == ["Jerusalem", "Tel Aviv"]


def test_get_image_no_id(client):
    response = client.get("/api/image")
    assert response.status_code != 200


def test_post_image(client):
    response = client.post("/api/image")
    assert response.status_code != 201
    image_name = 'geo_icon.png'
    image_path = os.path.join(BASE_TESTS_DIR, 'tests_images', image_name)
    response = client.post("/api/image", files={'image': (image_name, open(image_path, 'rb'), 'image/png')})
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['filename'] == image_name
    image_id = ObjectId(response_json['id'])
    response = client.get('/api/image', json={'id': response_json['id']})
    response.raise_for_status()
    assert response.content == open(image_path, 'rb').read()


def test_create_points_with_images(more_data, client):
    near_jerusalem = [data for data in more_data
                 if data['user_id'] == 'near Jerusalem'].pop()

    near_tel_aviv = [data for data in more_data
                 if data['user_id'] == 'near Tel Aviv'].pop()

    points = sorted([near_jerusalem, near_tel_aviv], key=lambda x: x['user_id'])
    images_names = os.listdir(os.path.join(BASE_TESTS_DIR, 'tests_images'))
    images_types = ['image/' + name[name.rindex('.') + 1:] for name in images_names]
    for i in range(2):
        image_path = os.path.join(BASE_TESTS_DIR, 'tests_images', images_names[i])
        response = client.post("/api/image", files={'image': (images_names[i], open(image_path, 'rb'), images_types[i])})
        data = {
            'longitude': points[i]['geometry']['coordinates'][0],
            'latitude': points[i]['geometry']['coordinates'][1],
            'user_id': points[i]['user_id'],
            'story': {
                'content': points[i]['story']['content'],
                'title': points[i]['story']['content'],
                'image_id': response.json()['id']
            }
        }
        response = client.post('/api/point', json=data)
        response.raise_for_status()
        assert response.status_code == status.HTTP_201_CREATED


def test_get_two_points_with_images(test_data, client):
    coordinates = [
        entry["geometry"]["coordinates"] for entry in test_data
        if entry["user_id"] == "Jerusalem"
    ].pop()
    response = client.get("/api/point",
                          params={
                              "longitude": coordinates[0],
                              "latitude": coordinates[1],
                              "max_distance": 150000
                          })
    response.raise_for_status()
    result = response.json()
    result = sorted([r for r in result if 'image_id' in r['story'] and r['story']['image_id']], key=lambda x: x['user_id'])
    assert len(result) == 2
    users = [entry["user_id"] for entry in result]
    assert users == ["near Jerusalem", "near Tel Aviv"]

    images_ids = [r['story']['image_id'] for r in result]
    assert len(set(images_ids)) == len(images_ids)
    images_names = os.listdir(os.path.join(BASE_TESTS_DIR, 'tests_images'))

    for i in range(2):
        response = client.get('/api/image', json={'id': images_ids[i]})
        response.raise_for_status()
        images_path = os.path.join(BASE_TESTS_DIR, 'tests_images', images_names[i])
        assert response.content == open(images_path, 'rb').read()


def test_get_contributors(client):
    response = client.get('/api/contributors')
    response.raise_for_status()
    result = response.json()
    assert len(result) == 4
    assert result == [{
        'name': 'nvg',
        'github_profile': 'https://github.com/nvgoldin'
    }, {
        'name': "josh",
        'github_profile': "https://github.com/jherskow"
    }, {
        'name': "nitay",
        'github_profile': "https://github.com/Nitay880"
    }, {
        'name': 'matanel',
        'github_profile': 'https://github.com/matanel-oren'
    }]
