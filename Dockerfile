FROM ghcr.io/renzholy/blogit:latest
WORKDIR /github/workflow
ENV NODE_ENV=production
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
