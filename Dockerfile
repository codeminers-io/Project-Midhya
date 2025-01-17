FROM nvidia/cuda:10.2-runtime-ubuntu18.04

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
        nvidia-modprobe \
        libpq-dev \
        nodejs \
        npm \
        postgresql-client \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
	;

RUN mkdir /workdir

WORKDIR /workdir

COPY / /workdir/

RUN npm install

EXPOSE 3000
