FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:alpine
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV GHP=$INPUT_token
ENV NEXT_PUBLIC_OWNER=$INPUT_owner
ENV NEXT_PUBLIC_REPO=$INPUT_repo
ENV NEXT_PUBLIC_BRANCH=$INPUT_branch
ENV NEXT_PUBLIC_INDEX=$INPUT_index
ENV NEXT_PUBLIC_LINKS=$INPUT_links

ONBUILD RUN yarn build
ONBUILD RUN yarn export
