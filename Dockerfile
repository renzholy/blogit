FROM node:16-slim
WORKDIR /app
ADD * /app
RUN yarn
ENTRYPOINT [ "yarn build && yarn export" ]
