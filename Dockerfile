FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update -y && \
    apt-get install -y \
        ca-certificates \
        build-essential \
        gfortran \
        g++ \
        git \
        python3 \
        python3-tk \
        python3-venv \
        python3-dev \
        python3-pip \
        libfreetype6-dev \
        dumb-init \
        libpq-dev \
		nodejs \
        ;

RUN mkdir /workdir

WORKDIR /workdir

COPY /* /workdir

RUN pip3 install -r rasa/requirements.txt

RUN npm install

EXPOSE 3000 5000