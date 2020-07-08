import json

import requests

API_SERVER = 'http://localhost:8342/api'
GEODATA_URL = 'https://raw.githubusercontent.com/yuvadm/geolocations-il/master/cities.geojson'
USERNAME = 'IsraelCities'
PASSWORD = 'x1x1x1'


def main():
    data = json.loads(requests.get(GEODATA_URL).content)
    user_data = dict(username=USERNAME,
                     password=PASSWORD,
                     email='israelcities@zulu.com',
                     full_name='IsraelCities',
                     about_me="I am a test user")
    response = requests.post(API_SERVER + '/auth/users', json=user_data)
    token_response = requests.post(
        API_SERVER + '/auth/token',
        data={
            'grant_type': 'password',
            'username': user_data['username'],
            'password': user_data['password'],
            'about_me': user_data['about_me']
        },
        headers={'content-type': "application/x-www-form-urlencoded"})

    token_response.raise_for_status()
    token = token_response.json()

    auth_header = {'Authorization': f'Bearer {token["access_token"]}'}

    with requests.Session() as session:
        session.headers.update(auth_header)
        for feature in data['features']:
            entry = {
                'longitude': feature['geometry']['coordinates'][0],
                'latitude': feature['geometry']['coordinates'][1],
                'story': {
                    'title': feature['properties']['name'],
                    'content': f'Automatically imported from {GEODATA_URL}'
                }
            }
            response = session.post(API_SERVER + '/story/point', json=entry)
            print(response.content)
            response.raise_for_status()
            print(f'Loaded: {entry}')


if __name__ == '__main__':
    main()
