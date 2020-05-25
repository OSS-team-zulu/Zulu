from typing import List

from geojson import Point
from pydantic import BaseModel, HttpUrl


class UserLocation(BaseModel):
    user_id: str
    longitude: float
    latitude: float

    def as_point(self):
        return Point((self.longitude, self.latitude))


class GeoJSONPoint(BaseModel):
    type: str = 'Point'
    coordinates: List


class UserLocationResponse(BaseModel):
    location: GeoJSONPoint
    user_id: str


class Contributors(BaseModel):
    name: str
    github_profile: HttpUrl
