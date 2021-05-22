FROM ghcr.io/renzholy/blogit:latest
WORKDIR /github/workspace
ENV NODE_ENV=production
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
