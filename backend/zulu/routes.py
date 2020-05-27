from typing import List
from fastapi import APIRouter, Depends, status
from geojson import Point
from zulu.db_tools import points_db,story_db
from zulu.models import UserLocation, UserLocationResponse, UserStory,Contributors,UserStoryResponse
api = APIRouter()


@api.get("/point", response_model=List[UserLocationResponse])
def get_points(db=Depends(points_db),
               longitude: float = 0.0,
               latitude: float = 0.0,
               max_distance: int = 5000):
    points = [
        point for point in db.find({
            "location": {
                "$nearSphere": {
                    "$geometry": Point((longitude, latitude)),
                    "$maxDistance": max_distance,
                },
            }
        })
    ]
    return points


@api.post("/point", status_code=status.HTTP_201_CREATED)
def create_point(location: UserLocation, db=Depends(points_db)):
    db.insert({"location": location.as_point(), "user_id": location.user_id})
    return {}


@api.get("/contributors", response_model=List[Contributors])
def get_contributors():
    return ({'name': "nvg", 'github_profile': "https://github.com/nvgoldin"},{'name':"nitai_m", 'github_profile': "https://github.com/Nitay880"})


    
@api.post("/upload_story", status_code=status.HTTP_201_CREATED)
def create_story(story:UserStory,db=Depends(story_db)):
    db.insert({"user_location": story.user_location.as_point(), "user_id": story.user_id,"subject":story.subject,"content":story.content})
    return {}

    """
    post format: (via postman)
    {
    "user_id": "Nitay mordechai @X@",
    "subject": "I love ya man",
    "content": "chocolate is nice",
    "user_location":{"longitude": 0.25,
                             "latitude": 244}
    }
    """


#get via /api/all_stories?

@api.get("/all_stories", response_model=List[UserStoryResponse])
def get_contributor(db=Depends(story_db)):
    return [s for s in db.find()]