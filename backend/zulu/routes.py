from typing import List

from fastapi import APIRouter, Depends, status
from geojson import Point
import json
from zulu.db_tools import points_db,user_db
from zulu.models import UserLocation,User, UserLocationResponse, Contributors,ObjectIdStr,UserStoryResponse
from bson import ObjectId
api = APIRouter()
def check_new_user(new_user_obj):
    #todo: test new user input
    return True
def check_new_story(new_story_obj):
    #todo: test new story input
    return True

    
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

@api.post("/create_user", status_code=status.HTTP_201_CREATED)
def create_user(new_user:User,db=Depends(user_db)):

    #print("new user Req: "+new_user.json())
    if check_new_user(new_user):
        print("added "+str(json.loads(new_user.json())))
        db.insert_one(json.loads(new_user.json()))
        return {"added":True}
    else:
        return{"added":False, "explain":''}


@api.post("/upload_post", status_code=status.HTTP_201_CREATED)
def create_post(user_post: UserLocation, db=Depends(points_db)):
    db.insert_one(json.loads(user_post.json()))


@api.get("/contributors", response_model=List[Contributors])
def get_contributors():
    return (
        {
            'name': "nvg",
            'github_profile': "https://github.com/nvgoldin"
        },
        {
            'name': "josh",
            'github_profile': "https://github.com/jherskow"
        },
        {
            'name': "nitay",
            'github_profile': "https://github.com/Nitay880"
        },
    )


## getters section, sanity check
@api.get("/all_users_ids", response_model=List[ObjectIdStr])
def get_contributor(db=Depends(user_db)):
    return [s['_id'] for s in db.find()] 
    
@api.get("/all_stories", response_model=List[UserStoryResponse])
def get_contributor(db=Depends(points_db)):
    return [s for s in db.find()] 
