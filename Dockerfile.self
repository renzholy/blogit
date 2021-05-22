FROM node:16-slim
WORKDIR /app
ADD * /app/
RUN yarn
