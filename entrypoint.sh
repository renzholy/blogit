#!/bin/sh

export NODE_ENV=production
export NEXT_PUBLIC_REF="${GITHUB_REF}"
export NEXT_PUBLIC_REPOSITORY="${GITHUB_REPOSITORY}"
cd /app
yarn build
yarn export
mv /app/out /github/workspace/out
