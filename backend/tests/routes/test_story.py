import os
from collections import namedtuple

import pytest
from fastapi import status

from zulu import db_tools

BASE_TESTS_DIR = os.path.join('tests')

_Image = namedtuple('_Image', 'id, path, name')


@pytest.fixture
def points_collection():
    db = next(db_tools.db())
    return db.points


@pytest.fixture
def jlm_coords():
    return [35.23702, 31.790886, 0]


@pytest.fixture
def test_data(jlm_coords):
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
            "coordinates": jlm_coords,
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
def loaded_images(authenticated_client):
    images = []
    images_path = os.path.join(BASE_TESTS_DIR, 'tests_images')
    for image_fname in os.listdir(images_path):
        if image_fname.endswith(('.png', 'jpg')):
            image_path = os.path.join(images_path, image_fname)
            with open(image_path, 'rb') as fd:
                response = authenticated_client.post(
                    '/api/story/image',
                    files={
                        'image': (image_fname, fd,
                                  f'image/{os.path.splitext(image_fname)[1]}')
                    })

                assert response.status_code == 201
                images.append(
                    _Image(id=response.json()['id'],
                           name=image_fname,
                           path=image_path))
    return images


@pytest.fixture(autouse=True)
def db_data(points_collection, test_data):
    points_collection.insert_many(test_data)


def test_get_points_basic(client):
    response = client.get("/api/story/point")
    assert response.status_code == 200


@pytest.mark.parametrize("user_id", ["Jerusalem", "New York", "Tel Aviv"])
def test_get_points_one_result(test_data, client, user_id):
    coordinates = [
        entry["geometry"]["coordinates"] for entry in test_data
        if entry["user_id"] == user_id
    ].pop()
    response = client.get("/api/story/point",
                          params={
                              "longitude": coordinates[0],
                              "latitude": coordinates[1],
                              "max_distance": 20,
                          })
    response.raise_for_status()
    result = response.json()
    assert len(result) == 1
    assert result[0]['user_id'] == user_id


def test_create_point_basic(test_data, authenticated_client):
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
    response = authenticated_client.post('/api/story/point', json=data)
    response.raise_for_status()
    assert response.status_code == status.HTTP_201_CREATED


def test_get_points_two_results(test_data, client):
    coordinates = [
        entry["geometry"]["coordinates"] for entry in test_data
        if entry["user_id"] == "Jerusalem"
    ].pop()
    response = client.get("/api/story/point",
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
    response = client.get("/api/story/image")
    assert response.status_code != 200


def test_post_image_no_data(authenticated_client):
    response = authenticated_client.post("/api/story/image")
    assert response.status_code != 201


def test_post_image(authenticated_client):
    image_name = 'geo_icon.png'
    image_path = os.path.join(BASE_TESTS_DIR, 'tests_images', image_name)
    response = authenticated_client.post(
        "/api/story/image",
        files={'image': (image_name, open(image_path, 'rb'), 'image/png')})

    assert response.status_code == 201
    response_json = response.json()

    assert response_json['filename'] == image_name

    response = authenticated_client.get('/api/story/image',
                                        params={'id': response_json['id']})
    response.raise_for_status()
    assert response.content == open(image_path, 'rb').read()


def test_post_points_with_images(more_data, authenticated_client):
    near_jerusalem = [
        data for data in more_data if data['user_id'] == 'near Jerusalem'
    ].pop()

    near_tel_aviv = [
        data for data in more_data if data['user_id'] == 'near Tel Aviv'
    ].pop()

    points = sorted([near_jerusalem, near_tel_aviv],
                    key=lambda x: x['user_id'])
    images_names = os.listdir(os.path.join(BASE_TESTS_DIR, 'tests_images'))
    images_types = [
        'image/' + name[name.rindex('.') + 1:] for name in images_names
    ]
    for i in range(2):
        image_path = os.path.join(BASE_TESTS_DIR, 'tests_images',
                                  images_names[i])
        response = authenticated_client.post("/api/story/image",
                                             files={
                                                 'image':
                                                 (images_names[i],
                                                  open(image_path,
                                                       'rb'), images_types[i])
                                             })
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
        response = authenticated_client.post('/api/story/point', json=data)
        response.raise_for_status()
        assert response.status_code == status.HTTP_201_CREATED


def test_get_multi_points_with_multi_images(test_data, authenticated_client,
                                            loaded_images, jlm_coords):
    for image, point in zip(loaded_images, test_data):
        data = {
            'longitude': point['geometry']['coordinates'][0],
            'latitude': point['geometry']['coordinates'][1],
            'user_id': point['user_id'],
            'story': {
                'content': point['user_id'].upper(),
                'title': point['user_id'].lower(),
                'image_id': image.id
            }
        }
        response = authenticated_client.post('/api/story/point', json=data)
        response.raise_for_status()
        assert response.status_code == status.HTTP_201_CREATED

    response = authenticated_client.get("/api/story/point",
                                        params={
                                            "longitude": jlm_coords[0],
                                            "latitude": jlm_coords[1],
                                            "max_distance": 100000000000000,
                                        })
    response.raise_for_status()
    result = response.json()

    result = [
        r['story']['image_id'] for r in result
        if 'image_id' in r['story'] and r['story']['image_id']
    ]

    assert len(result) == len(loaded_images)

    assert sorted(result) == sorted([image.id for image in loaded_images])


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
