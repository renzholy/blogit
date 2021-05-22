#!/bin/sh

mv /app/* ./
yarn build
yarn export
