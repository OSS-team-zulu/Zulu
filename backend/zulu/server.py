import argparse
import logging

import uvicorn
from dynaconf import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from zulu.db_tools import init_db
from zulu.routes import auth, contributors, story

app = FastAPI()

logging.basicConfig(level=logging.INFO)

LOG = logging.getLogger(__name__)
app = FastAPI(title='Zulu app', )

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8342",
    "http://127.0.0.1:8342",
    f"http://{settings.API_HOST}:{settings.API_PORT}",
    f"https://{settings.API_HOST}:{settings.API_PORT}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story.api, prefix='/api/story')
app.include_router(auth.api, prefix='/api/auth')
app.include_router(contributors.api, prefix='/api/contributors')


@app.on_event('startup')
def startup_event():
    init_db()


if __name__ == '__main__':
    parser = argparse.ArgumentParser('Zulu BE API')
    parser.add_argument('-p', '--port', default=settings.API_PORT)
    parser.add_argument('-o', '--host', default=settings.API_HOST)
    parser.add_argument('-r', '--reload', default=settings.UVICORN_RELOAD)
    args = parser.parse_args()
    LOG.info('Starting uvicorn')

    uvicorn.run(
        'server:app',
        host=args.host,
        port=args.port,
        reload=args.reload,
    )
