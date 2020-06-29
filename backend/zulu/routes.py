from typing import List

from fastapi import APIRouter, Depends, status, File, UploadFile, HTTPException
from starlette.responses import StreamingResponse
from geojson import Point
from bson.objectid import ObjectId
from bson.errors import InvalidId
import io

from zulu.db_tools import points_db, images_db
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


@api.get("/image")
def get_image(id: str, db=Depends(images_db)):
    try:
        record = db.find_one({'_id': ObjectId(id)})
    except InvalidId:
        raise HTTPException(status_code=404, detail="Image not found. Id is not valid")
    if not record:
        raise HTTPException(status_code=404, detail="Image not found")
    return StreamingResponse(io.BytesIO(record['image']), media_type=record['content_type'])


@api.post("/image", status_code=status.HTTP_201_CREATED)
def add_image(image: UploadFile = File(...), db=Depends(images_db)):
    image_id = db.insert({'image': image.file.read(),
                          'content_type': image.content_type,
                          'filename': image.filename})
    return {'id': str(image_id), 'filename': image.filename}


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
