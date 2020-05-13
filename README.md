# Zulu app



## Running the backend
1. Make sure you have mkvirtualenv/git/python3.8/docker-compose installed
2. Installing requirements (one time)
```bash
mkvirtualenv -p python3.8 zulu
cd backend
pip install -r requirements.txt
pip install -r test-requirements.txt
```

3. Starting MongoDB
```bash
docker-compose -d up
```

4. Running the API server:
```python
cd backend
PYTHONPATH=$PYTHONPATH:$PWD python zulu/server.py
```

5. Log into http://0.0.0.0:8342/docs to see the API docs


### Running backend tests
1. Make sure MongoDB is up (**warning**: the tests would remove its data)
2. Run:
```bash
PYTHONPATH=$PYTHONPATH:$PWD pytest -vvv -s tests/
```


## Running the frontend
TODO


## Running both for development
TODO

## Running both in `docker-compose`
TODO



