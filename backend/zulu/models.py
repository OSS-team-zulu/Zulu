from typing import List

from geojson import Point
from pydantic import BaseModel, HttpUrl


class UserStory(BaseModel):
    title: str
    content: str
    image_id: str = None


class UserLocation(BaseModel):
    user_id: str
    longitude: float
    latitude: float
    story: UserStory

    def as_point(self):
        return Point((self.longitude, self.latitude))


class GeoJSONPoint(BaseModel):
    type: str = 'Point'
    coordinates: List


class UserLocationResponse(BaseModel):
    geometry: GeoJSONPoint
    story: UserStory
    user_id: str


class ImageId(BaseModel):
    id: str


class ImagePostResponse(BaseModel):
    id: str
    filename: str


class Contributors(BaseModel):
    name: str
    github_profile: HttpUrl
