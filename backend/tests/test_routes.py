import pytest
from fastapi.testclient import TestClient

from zulu import db_tools
from zulu.server import app


@pytest.fixture
def client():
    yield TestClient(app)


@pytest.fixture
def db():
    yield next(db_tools.points_db())


@pytest.fixture
def test_data():
    return [{
        "location": {
            "type": "Point",
            "coordinates": [34.8562505, 32.1423376],
        },
        "user_id": "Tel Aviv"
    }, {
        "location": {
            "type": "Point",
            "coordinates": [35.23702, 31.790886, 0],
        },
        "user_id": "Jerusalem"
    }, {
        "location": {
            "type": "Point",
            "coordinates": [-74.071789, 40.6409],
        },
        "user_id": "New York"
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
        entry["location"]["coordinates"] for entry in test_data
        if entry["user_id"] == user_id
    ].pop()
    response = client.get("/api/point",
                          params={
                              "longitude": coordinates[0],
                              "latitude": coordinates[1],
                              "max_distance": 20
                          })
    response.raise_for_status()
    result = response.json()
    assert len(result) == 1
    assert result[0]['user_id'] == user_id


def test_get_points_two_results(db_data, test_data, client):
    coordinates = [
        entry["location"]["coordinates"] for entry in test_data
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


def test_get_contributors(client):
    response = client.get('/api/contributors')
    response.raise_for_status()
    result = response.json()
    assert len(result) == 4
    assert result == [{
        'name': 'matanel',
        'github_profile': 'https://github.com/matanel-oren'
    }, {
        'name': 'nvg',
        'github_profile': 'https://github.com/nvgoldin'
    }, {
        'name': "josh",
        'github_profile': "https://github.com/jherskow"
    }, {
        'name': "nitay",
        'github_profile': "https://github.com/Nitay880"
    }]
