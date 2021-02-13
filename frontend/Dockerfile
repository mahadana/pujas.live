FROM node:14
RUN mkdir -p /app/shared /app/frontend && \
    chown -R node:node /app
WORKDIR /app/frontend
USER node
ENV NODE_ENV=production
EXPOSE 3000

COPY --chown=node:node shared/package*.json /app/shared/
COPY --chown=node:node frontend/package*.json /app/frontend/
RUN npm clean-install --silent --production

COPY --chown=node:node shared /app/shared
COPY --chown=node:node frontend /app/frontend

ARG BACKEND_URL
ARG HCAPTCHA_SITE_KEY
ARG PLAUSIBLE_DOMAIN_KEY
ARG PLAUSIBLE_URL
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG SITE_NAME

RUN NEXT_PUBLIC_BACKEND_URL=$BACKEND_URL \
    NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY \
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN_KEY=$PLAUSIBLE_DOMAIN_KEY \
    NEXT_PUBLIC_PLAUSIBLE_URL=$PLAUSIBLE_URL \
    NEXT_PUBLIC_S3_BUCKET=$S3_BUCKET \
    NEXT_PUBLIC_S3_ENDPOINT=$S3_ENDPOINT \
    NEXT_PUBLIC_SITE_NAME=$SITE_NAME \
    npm run build

CMD ["npm", "start"]
