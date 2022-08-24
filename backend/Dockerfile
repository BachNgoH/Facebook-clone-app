# base image
FROM python:3.10.5

# setup environment variable
ENV DockerHome=/app
ENV PYTHONUNBUFFERED 1

# set work directory
RUN mkdir -p ${DockerHome}
RUN pip install --upgrade pip

COPY . ${DockerHome}
WORKDIR /app


COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt



EXPOSE 8000
