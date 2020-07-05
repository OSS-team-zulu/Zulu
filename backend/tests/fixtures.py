import pytest
from fastapi import status
from fastapi.testclient import TestClient

from zulu.server import app


@pytest.fixture
def client():
    yield TestClient(app)


@pytest.fixture
def user_data():
    return dict(username='zulu',
                password='uluz',
                email='momo@zulu.com',
                full_name='Zulu Uluz')


@pytest.fixture
def some_user(client, user_data):
    response = client.post('/api/auth/users', json=user_data)
    response.raise_for_status()
    assert response.status_code == status.HTTP_201_CREATED
    user = response.json()
    assert user['username'] == user_data['username']

    return user


@pytest.fixture
def authenticated_client(some_user, user_data):
    client = TestClient(app)
    token_response = client.post(
        "/api/auth/token",
        data={
            'grant_type': 'password',
            'username': user_data['username'],
            'password': user_data['password'],
        },
        headers={'content-type': "application/x-www-form-urlencoded"})

    token_response.raise_for_status()
    token = token_response.json()

    response = client.get(
        '/api/auth/users/me/',
        headers={'Authorization': f'Bearer {token["access_token"]}'})
    response.raise_for_status()
    user = response.json()
    assert user['username'] == user_data['username']

    client.headers.update({'Authorization': f'Bearer {token["access_token"]}'})
    yield client
