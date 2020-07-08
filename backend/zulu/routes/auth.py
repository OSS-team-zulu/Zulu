# Modified from: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/

from datetime import timedelta

from dynaconf import settings
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic.networks import EmailStr

from zulu.auth_utils import (authenticate_user, create_access_token,
                             get_current_active_user, get_password_hash,
                             get_user, AuthenticationError)
from zulu.db_tools import users_db
from zulu.models import Token, User

api = APIRouter()


@api.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                                 db=Depends(users_db)):
    try:
        user = authenticate_user(db, form_data.username, form_data.password)
    except AuthenticationError:
        raise HTTPException(status_code=400,
                            detail="Incorrect username or password")
    access_token_expires = timedelta(
        minutes=settings.AUTH_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.username,
            "scopes": form_data.scopes
        },
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


@api.get("/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@api.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(db=Depends(users_db),
                      password: str = Body(...),
                      email: EmailStr = Body(...),
                      full_name: str = Body(default=None),
                      username: str = Body(...),
                      about_me: str = Body(default="")):
    user = get_user(db=db, username=username)

    if user:
        raise HTTPException(
            status_code=400,
            detail='The user with this username already exists')
    result = db.insert_one({
        'email': email,
        'hashed_password': get_password_hash(password),
        'full_name': full_name,
        'username': username,
        'about_me': about_me,
        'disabled': False,
        'super_user': False,
    })
    if result.acknowledged is False:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail='Unknown error occured')

    user_in_db = db.find_one({'_id': result.inserted_id})
    return User(**user_in_db)
