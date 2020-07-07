
install:
	pip3 install -r backend/requirements.txt
	pip3 install -r backend/test-requirements.txt
	cd frontend/zulu; npm install

run_full:
	docker-compose up
	
build_full:
	docker-compose up --build
	
run_backend:
	docker-compose up -d mongo
ifeq ($(OS), Windows_NT)
	cd backend && set PYTHONPATH=. && python3 zulu/server.py
else
	cd backend; PYTHONPATH=$(PYTHONPATH):$(PWD) python3 zulu/server.py
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
