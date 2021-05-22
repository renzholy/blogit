#!/bin/sh

cd /app
yarn build
yarn export
mv /app/out /github/workflow/out
