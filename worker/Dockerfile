FROM node:14
RUN mkdir -p /app/worker && chown -R node:node /app
WORKDIR /app/worker
USER node
ENV NODE_ENV=production

COPY --chown=node:node worker/package*.json /app/worker/
RUN npm clean-install --silent --production

COPY --chown=node:node shared /app/shared
COPY --chown=node:node worker /app/worker
RUN npm run build

CMD ["npm", "start"]
