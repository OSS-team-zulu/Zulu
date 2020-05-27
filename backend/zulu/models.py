from typing import List

from geojson import Point
from pydantic import BaseModel, HttpUrl

class Location(BaseModel):
    longitude: float
    latitude: float
    def as_point(self):
        return Point((self.longitude, self.latitude))

class UserLocation(BaseModel):
    user_id: str
    user_location: Location

    def as_point(self):
        return UserLocation.as_point()

class UserStory(BaseModel):
    user_id: str
    user_location: Location
    subject: str
    content: str
    

class GeoJSONPoint(BaseModel):
    type: str = 'Point'
    coordinates: List

class UserLocationResponse(BaseModel):
    location: GeoJSONPoint
    user_id: str


class UserStoryResponse(BaseModel):
    user_location: GeoJSONPoint
    subject: str
    content: str
    user_id: str


class Contributors(BaseModel):
    name: str
    github_profile: HttpUrl
