FROM node:14
RUN mkdir -p /app/frontend && chown -R node:node /app
WORKDIR /app/frontend
USER node

COPY --chown=node:node frontend/package*.json /app/frontend/
RUN npm clean-install --silent --production

COPY --chown=node:node docker /app/docker
COPY --chown=node:node frontend /app/frontend

ARG API_URL
ARG HCAPTCHA_SITE_KEY
ARG PLAUSIBLE_DOMAIN_KEY
ARG PLAUSIBLE_URL

ENV NEXT_PUBLIC_API_URL $API_URL
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY $HCAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN_KEY $PLAUSIBLE_DOMAIN_KEY
ENV NEXT_PUBLIC_PLAUSIBLE_URL $PLAUSIBLE_URL

RUN NODE_ENV=production npm run build

ENTRYPOINT NODE_ENV=production npm start
EXPOSE 3000
