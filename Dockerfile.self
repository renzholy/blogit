FROM node:16-slim
ENV NODE_ENV production
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build
