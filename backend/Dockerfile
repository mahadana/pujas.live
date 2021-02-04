FROM node:14
RUN mkdir -p /app/backend/public/uploads && chown -R node:node /app
WORKDIR /app/backend
USER node
ENV NODE_ENV=production
EXPOSE 1337

COPY --chown=node:node backend/package*.json /app/backend/
RUN npm clean-install --silent --production

COPY --chown=node:node docker /app/docker
COPY --chown=node:node backend /app/backend
RUN npm run build

CMD ["npm", "start"]
