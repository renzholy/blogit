FROM ghcr.io/renzholy/blogit:latest
ENV NODE_ENV=production
WORKDIR /app
RUN yarn export
