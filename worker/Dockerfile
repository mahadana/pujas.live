FROM node:14
RUN mkdir -p /app/worker && chown -R node:node /app
WORKDIR /app/worker
USER node

COPY --chown=node:node worker/package*.json /app/worker/
RUN npm clean-install --silent --production

COPY --chown=node:node docker /app/docker
COPY --chown=node:node worker /app/worker
RUN NODE_ENV=production npm run build

ENTRYPOINT NODE_ENV=production npm start
