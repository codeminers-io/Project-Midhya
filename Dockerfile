FROM node:latest

RUN mkdir /workdir

WORKDIR /workdir

COPY / /workdir/

RUN npm install

EXPOSE 3000
