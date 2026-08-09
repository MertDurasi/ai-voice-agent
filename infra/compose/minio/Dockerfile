FROM golang:1.26.5-alpine3.24@sha256:0178a641fbb4858c5f1b48e34bdaabe0350a330a1b1149aabd498d0699ff5fb2 AS build

ARG MINIO_VERSION

RUN test -n "${MINIO_VERSION}"
RUN CGO_ENABLED=0 go install -trimpath -ldflags="-s -w" github.com/minio/minio@${MINIO_VERSION}

FROM alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b

RUN apk add --no-cache ca-certificates \
  && addgroup -S -g 10001 minio \
  && adduser -S -D -H -u 10001 -G minio minio \
  && mkdir -p /data \
  && chown minio:minio /data

COPY --from=build /go/bin/minio /usr/local/bin/minio

USER minio:minio
EXPOSE 9000 9001
VOLUME ["/data"]
ENTRYPOINT ["minio"]
