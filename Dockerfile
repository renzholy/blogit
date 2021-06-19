FROM ghcr.io/renzholy/blogit:latest
WORKDIR /app
ENV NODE_ENV=production
COPY entrypoint.sh /entrypoint.sh
ENV NEXT_PUBLIC_REF=${GITHUB_REF}
ENV NEXT_PUBLIC_REPOSITORY=${GITHUB_REPOSITORY}
ENTRYPOINT [ "/entrypoint.sh" ]
