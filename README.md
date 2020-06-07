# Zulu app
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![Backend unit tests](https://github.com/OSS-team-zulu/Zulu/workflows/Backend%20unit%20tests/badge.svg?branch=master)

## About the app

### A Local exploration App

*A social platform that allows viewing stories based on geographical location*

 - A local social app where people can share (anonymously or otherwise) personal histories attached to specific locations. Ranging from historical tidbits and recommendations to personal stories about life events or emotions connected to this location.
 - Users can become tourists in familiar locations, viewing the world through other's eyes, as well as a more intimate peak into
 - main interface is a map of local stories.
	 - Maybe only the immediate surroundings can be seen?


## Current status

The application is in early development stage, right now you can run: 
* The backend, based on Python/FastAPI/MongoDB
* The frontend, based on React
* Deployment based on Docker/Docker-compose

There is still no connectivity between the Backend and Frontend.  


### Running Zulu locally

1. Make sure you have [docker-compose](https://docs.docker.com/compose/install/) installed on Linux
2. Clone this project: 
	```shell
	git clone https://github.com/OSS-team-zulu/Zulu.git
	cd Zulu
	```
3. Bring up the services using `docker-compose`:
	```shell
	docker-compose up
	```
4. Web UI: http://localhost:8085, Backend API: http://localhost:8086/docs 


## Contributing
This project is under the [MIT License](./LICENSE.md)
### Bugs
If you hit a bug - open an issue under this repository.
### Contributing code
Code contributions are welcomed!

First, read our guidelines at [Backend](./backend/README.md) and [Frontend](./frontend/README.md) in order to setup a development environment. 

Afterwards:
1. Fork this repository
2. Apply your code changes in your forked branch
3. Open a pull request

## Project & Team Info

#### Tracking tasks
1. Tasks are tracked using GitHub issues
2. We use GitHub Kanban board for planning - [https://github.com/OSS-team-zulu/Zulu/projects/1](https://github.com/OSS-team-zulu/Zulu/projects/1)


#### Contributors  
 - FE Architect & Team Lead -  https://github.com/jherskow
 - Frameworks + QA  - **Batkiller Ariel**
 - Security - **Nitai Mordechai**
 - Data Science & BI - https://github.com/matanel-oren
 - BE - https://github.com/nvgoldin
