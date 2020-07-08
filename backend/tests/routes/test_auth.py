def test_token_invalid_username(client):
    response = client.post(
        "/api/auth/token",
        data={
            'grant_type': 'password',
            'username': 'koko',
            'password': 'bobo',
        },
        headers={'content-type': "application/x-www-form-urlencoded"})

    assert response.status_code == 400
    assert 'Incorrect username' in response.json()['detail']


def test_user_me(client, some_user, user_data):
    token_response = client.post(
        "/api/auth/token",
        data={
            'grant_type': 'password',
            'username': user_data['username'],
            'password': user_data['password'],
            'about_me': user_data['about_me']
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
    assert user['about_me'] == user_data['about_me']
