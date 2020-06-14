import json

import requests

URL = 'https://raw.githubusercontent.com/yuvadm/geolocations-il/master/cities.geojson'
API_SERVER = 'http://localhost:8342/api/point'


def main():
    data = json.loads(requests.get(URL).content)
    for feature in data['features']:
        entry = {
            'longitude': feature['geometry']['coordinates'][0],
            'latitude': feature['geometry']['coordinates'][1],
            'user_id': 'The GeoBot',
            'story': {
                'title': feature['properties']['name'],
                'content': f'Automatically imported from {URL}'
            }
        }
        response = requests.post(API_SERVER, json=entry)
        response.raise_for_status()
        print(f'Loaded: {entry}')


if __name__ == '__main__':
    main()
