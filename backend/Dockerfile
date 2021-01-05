FROM node:14
RUN mkdir -p /app/backend/public/uploads && chown -R node:node /app
WORKDIR /app/backend
USER node

COPY --chown=node:node backend/package*.json /app/backend/
RUN npm install --silent --production

COPY --chown=node:node shared /app/shared
COPY --chown=node:node backend /app/backend
RUN NODE_ENV=production npm run build

ENTRYPOINT NODE_ENV=production node lib/init && \
  NODE_ENV=production npm start
EXPOSE 1337
