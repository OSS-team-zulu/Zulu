from typing import List

from fastapi import APIRouter

from zulu.models import Contributors

api = APIRouter()


@api.get("/", response_model=List[Contributors])
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
