import uvicorn
from fastapi import FastAPI

from zulu import routes
from zulu.db_tools import init_db

app = FastAPI(title='Zulu app', )

app.include_router(routes.api, prefix='/api')


@app.on_event('startup')
def startup_event():
    init_db()


if __name__ == '__main__':
    uvicorn.run(
        'server:app',
        host='0.0.0.0',
        port=8342,
        reload=True,
    )
