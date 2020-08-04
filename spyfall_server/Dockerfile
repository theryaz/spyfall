FROM node:12.18.3-alpine

COPY dist /app
COPY node_modules /app/spyfall_server/node_modules
COPY package.json /app/spyfall_server/package.json

WORKDIR /app

CMD node /app/spyfall_server/src/server.js