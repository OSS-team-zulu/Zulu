
install:
	pip install -r backend/requirements.txt
	pip install -r backend/test-requirements.txt
	cd frontend/zulu; npm install

run_full:
	docker-compose up
	
build_full:
	docker-compose up --build
	
run_backend:
	docker-compose up -d mongo
ifeq ($(OS), Windows_NT)
	cd backend && set PYTHONPATH=. && python zulu/server.py
else
	cd backend; PYTHONPATH=$(PYTHONPATH):$(PWD) python zulu/server.py
endif
	
run_frontend:
	cd frontend/zulu; npm run start

run_tests:
	docker-compose up -d mongo
ifeq ($(OS), Windows_NT)
	cd backend; set PYTHONPATH=. & pytest -vvv -s tests/
else
	cd backend; PYTHONPATH=$(PYTHONPATH):$(PWD) pytest -vvv -s tests/
endif