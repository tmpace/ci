FROM node:8.5.0

WORKDIR /app

ADD . /app

RUN ["npm", "install"]

CMD ["npm", "start"]
