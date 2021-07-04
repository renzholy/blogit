#!/bin/sh

export NEXT_PUBLIC_REF="${GITHUB_REF}"
export NEXT_PUBLIC_REPOSITORY="${GITHUB_REPOSITORY}"
export NEXT_PUBLIC_CNAME="${INPUT_CNAME}"
export NEXT_PUBLIC_TITLE="${INPUT_TITLE}"
export NEXT_PUBLIC_INDEX="${INPUT_INDEX}"
export NEXT_PUBLIC_HEADER="${INPUT_HEADER}"
export NEXT_PUBLIC_FOOTER="${INPUT_FOOTER}"
cd /app
yarn build
yarn export
mv /app/out /github/workspace/out
