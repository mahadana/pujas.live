FROM node:14
RUN mkdir -p /app && chown node:node /app
WORKDIR /app
USER node
COPY --chown=node:node package*.json /app/
RUN npm install --silent --production

COPY --chown=node:node . /app
RUN NODE_ENV=production npm run build
ENTRYPOINT NODE_ENV=production npm start
EXPOSE 1337
