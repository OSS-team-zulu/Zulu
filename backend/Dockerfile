FROM python:3.8
WORKDIR /code
COPY requirements.txt /code
RUN pip install -r requirements.txt

COPY . /code
ENV PYTHONPATH /code
ENTRYPOINT ["python", "zulu/server.py"]