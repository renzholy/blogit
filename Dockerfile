FROM ghcr.io/renzholy/blogit:latest
ENV NODE_ENV=production
RUN yarn export
