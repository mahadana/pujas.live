FROM node:14
RUN mkdir -p /app/frontend && chown -R node:node /app
WORKDIR /app/frontend
USER node

COPY --chown=node:node frontend/package*.json /app/frontend/
RUN npm install --silent --production

COPY --chown=node:node shared /app/shared
COPY --chown=node:node frontend /app/frontend
RUN NODE_ENV=production npm run build

ENTRYPOINT NODE_ENV=production npm start
EXPOSE 3000
