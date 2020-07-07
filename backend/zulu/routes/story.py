import io
from typing import List
from datetime import date
from bson.errors import InvalidId
from bson.objectid import ObjectId
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from geojson import Point
from starlette.responses import StreamingResponse

from zulu.auth_utils import get_current_active_user
from zulu.db_tools import db
from zulu.models import (ImageId,StoryId, CommentPostResponse,ImagePostResponse, User, UserLocationRequest,
                         UserLocationResponse,CommentModel)

api = APIRouter()


@api.get("/point", response_model=List[UserLocationResponse])
def get_points(db=Depends(db),
               longitude: float = 0.0,
               latitude: float = 0.0,
               max_distance: int = 5000):
    points = [
        point for point in db.points.find({
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
def create_point(location: UserLocationRequest,
                 db=Depends(db),
                 current_user: User = Depends(get_current_active_user)):

    db.points.insert_one({
        "geometry": location.as_point(),
        "story": {
            'title': location.story.title,
            'content': location.story.content,
            'image_id': location.story.image_id,
        },
        "user_id": current_user.username
    })
    return {}


@api.get("/image")
def get_image(image_id: str, db=Depends(db)):
    try:
        record = db.images.find_one({'_id': ObjectId(image_id)})
    except InvalidId:
        raise HTTPException(status_code=404,
                            detail="Image not found. Id is not valid")
    if not record:
        raise HTTPException(status_code=404, detail="Image not found")
    return StreamingResponse(io.BytesIO(record['image']),
                             media_type=record['content_type'])


@api.post("/image",
          status_code=status.HTTP_201_CREATED,
          response_model=ImagePostResponse)
def add_image(image: UploadFile = File(...),
              db=Depends(db),
              current_user: User = Depends(get_current_active_user)):
    image_id = db.images.insert({
        'image': image.file.read(),
        'content_type': image.content_type,
        'filename': image.filename
    })
    return {'image_id': str(image_id), 'filename': image.filename}

@api.get("/comment", response_model=List[CommentPostResponse])
def get_comments(id:str, db=Depends(db)):
    try:
        print(id)
        comments=[comment for comment in db.comments.find({'story_id': id})]
    except :
        raise HTTPException(status_code=404,
                            detail="Id is not valid")
    if not comments:
        raise HTTPException(status_code=404, detail="Story not found with id "+id)
    return comments

@api.post("/comment",
          status_code=status.HTTP_201_CREATED)
def add_comment(comment:CommentModel,
              db=Depends(db),current_user: User = Depends(get_current_active_user)):

    print(comment.is_wiki)

    comment_id = db.comments.insert({
        'story_id': comment.story_id,
        'is_wiki':comment.is_wiki,
        'comment': comment.content,
        'insertion_date': str(date.today()),
        'user_name': current_user.username
    })
    return {}