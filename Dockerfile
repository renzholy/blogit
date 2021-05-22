FROM node:16-slim
WORKDIR /app
ADD * /app/
RUN yarn
RUN yarn build
RUN yarn export
