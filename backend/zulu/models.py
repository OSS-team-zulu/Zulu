from typing import List
from geojson import Point
from pydantic import BaseModel, HttpUrl
from bson.objectid import ObjectId


class ObjectIdStr(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, ObjectId):
            raise ValueError("Not a valid ObjectId")
        return str(v)


class Location(BaseModel):
    longitude: float
    latitude: float
    def as_point(self):
        return Point((self.longitude, self.latitude))


class User(BaseModel):
    user_id:str 
    user_pass:str  
    user_mail: str

class UserStory(BaseModel):
    subject: str
    content: str 


class UserLocation(BaseModel):
    user: ObjectIdStr=None #User Object ID reference
    user_location: Location
    user_story:UserStory
    def as_point(self):
        return user_location.as_point()    

class GeoJSONPoint(BaseModel):
    type: str = 'Point'
    coordinates: List

class UserLocationResponse(BaseModel):
    location: GeoJSONPoint
    user_id: str

class UserStoryResponse(BaseModel):
    location: GeoJSONPoint
    user_id: str 
    user_story: UserStory =None

class Contributors(BaseModel):
    name: str
    github_profile: HttpUrl
