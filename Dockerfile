FROM ghcr.io/RenzHoly/blogit
ENV NODE_ENV=production
RUN yarn export
