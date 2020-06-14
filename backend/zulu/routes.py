from typing import List

from fastapi import APIRouter, Depends, status
from geojson import Point

from zulu.db_tools import points_db
from zulu.models import Contributors, UserLocation, UserLocationResponse

api = APIRouter()


@api.get("/point", response_model=List[UserLocationResponse])
def get_points(db=Depends(points_db),
               longitude: float = 0.0,
               latitude: float = 0.0,
               max_distance: int = 5000):
    points = [
        point for point in db.find({
            "geometry": {
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
    db.insert({
        "geometry": location.as_point(),
        "story": {
            'title': location.story.title,
            'content': location.story.content,
        },
        "user_id": location.user_id
    })
    return {}


@api.get("/contributors", response_model=List[Contributors])
def get_contributors():
    return ({
        'name': "nvg",
        'github_profile': "https://github.com/nvgoldin"
    }, {
        'name': "josh",
        'github_profile': "https://github.com/jherskow"
    }, {
        'name': "nitay",
        'github_profile': "https://github.com/Nitay880"
    }, {
        'name': "matanel",
        'github_profile': "https://github.com/matanel-oren"
    })
