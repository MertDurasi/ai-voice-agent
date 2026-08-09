FROM axllent/mailpit:v1.30.0@sha256:0059ef81e492a7192af3816281eed6859eb078bd7bdc58b76757c13e10e53a7d AS upstream

FROM alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b

RUN addgroup -S -g 10002 mailpit \
  && adduser -S -D -H -u 10002 -G mailpit mailpit \
  && mkdir -p /data \
  && chown mailpit:mailpit /data

COPY --from=upstream /mailpit /usr/local/bin/mailpit

USER mailpit:mailpit
EXPOSE 1025 8025
VOLUME ["/data"]
ENTRYPOINT ["mailpit"]
