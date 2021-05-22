#!/bin/sh

cd /app
yarn build
yarn export
mv /app/out /github/workspace/out
touch /github/workspace/out/.nojekyll
