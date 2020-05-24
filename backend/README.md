# Zulu application backend

## Running the backend locally

1. Make sure you have the following installed (tested on Ubuntu):
   * Install [mkvirtualenv](https://virtualenvwrapper.readthedocs.io/en/latest/install.html) for easy Python virtual environment management.
   * Python 3.8
   * You have [docker-compose](https://docs.docker.com/compose/install/) in order to run [MongoDB](https://www.mongodb.com/)
2. Setup your Python virtual environment:
   ```shell
   mkvirtualenv -p python3.8 zulu
   ```
3. Install project requirements:
   ```shell
   pip install -r backend/requirements.txt
   pip install -r backend/test-requirements.txt
   ```
4. Starting MongoDB
   ```shell
   docker-compose -d up mongo
   ```
5. Running the API server:
   ```shell
   cd backend
   PYTHONPATH=$PYTHONPATH:$PWD python zulu/server.py
   ```
6. Log into http://0.0.0.0:8342/docs to see the API docs


### Running the tests tests
1. Make sure MongoDB is up (**warning**: the tests would remove its data)
2. Run:
   ```bash
   PYTHONPATH=$PYTHONPATH:$PWD pytest -vvv -s tests/
   ```
