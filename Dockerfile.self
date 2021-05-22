FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
ENTRYPOINT [ "yarn", "build" ]
