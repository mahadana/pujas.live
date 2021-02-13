#!/bin/bash

set -eou pipefail
cd "$(dirname $0)/../.."

NEXT_PUBLIC_VARS="
  BACKEND_URL HCAPTCHA_SITE_KEY PLAUSIBLE_DOMAIN_KEY
  PLAUSIBLE_URL S3_BUCKET S3_ENDPOINT SITE_NAME"

source .env.example

for name in $(cat .env.example | grep -v '^#' | \
              grep -v '^\s*$' | sed 's/=.*$//'); do
  echo "${name}=${!name}" >> $GITHUB_ENV
done

for name in $NEXT_PUBLIC_VARS; do
  echo "NEXT_PUBLIC_${name}=${!name}" >> $GITHUB_ENV
done
