FROM node:lts-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts-alpine
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
