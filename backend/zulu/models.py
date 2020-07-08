from typing import List
import datetime
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


class CommentPostResponse(BaseModel):
    story_id: str
    comment: str = None
    user_name: str = None
    insertion_date: datetime.date = None
    is_wiki: bool = False


class CommentModel(BaseModel):
    story_id: str
    content: str
    is_wiki: bool = False


class ImageId(BaseModel):
    id: str


class ImagePostResponse(BaseModel):
    image_id: str
    filename: str


class Contributors(BaseModel):
    name: str
    github_profile: HttpUrl


class Token(BaseModel):
    access_token: str
    token_type: str


class StoryId(BaseModel):
    id: str


class TokenData(BaseModel):
    username: str = None
    scopes: List[str] = []


class User(BaseModel):
    username: str
    email: str = None
    full_name: str = None
    disabled: bool = None
    super_user: bool = False
    about_me: str = None


class UserInDB(User):
    hashed_password: str
