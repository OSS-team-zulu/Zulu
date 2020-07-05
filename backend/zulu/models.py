from typing import List

from geojson import Point
from pydantic import BaseModel, HttpUrl


class UserStory(BaseModel):
    title: str
    content: str
    image_id: str = None


class UserLocationRequest(BaseModel):
    longitude: float
    latitude: float
    story: UserStory

    def as_point(self):
        return Point((self.longitude, self.latitude))


class UserLocation(UserLocationRequest):
    user_id: str


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


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None
    scopes: List[str] = []


class User(BaseModel):
    username: str
    email: str = None
    full_name: str = None
    disabled: bool = None
    super_user: bool = False


class UserInDB(User):
    hashed_password: str
