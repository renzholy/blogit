FROM ghcr.io/renzholy/blogit:e20c12c857f44103408099373c45bd59841040c8
WORKDIR /github/workspace
ENV NODE_ENV=production
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]
