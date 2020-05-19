# Zulu app

## About the app

### Zulu - A Local exploration App

**A social platform that allows viewing stories based on geographical location**

 - A local social app where people can share (anonymously or otherwise) personal histories attached to specific locations. Ranging from historical tidbits and recommendations to personal stories about life events or emotions connected to this location.
 - Users can become tourists in familiar locations, viewing the world through other's eyes, as well as a more intimate peak into
 - main interface is a map of local stories.
	 - Maybe only the immediate surroundings can be seen?

## Project & Team Info

#### Roles
 - FE Architect & Team Lead - **Joshua Herskowitz**
 - BE Architect & DevOps - **Nadav Goldin**
 - Frameworks + QA  - **Batkiller Ariel**
 - Security - **Nitai Mordechai**
 - Data Science & BI - **Matanel Oren**

#### Kanban
[https://github.com/OSS-team-zulu/Zulu/projects/1](https://github.com/OSS-team-zulu/Zulu/projects/1)


# Running the backend
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



