FROM python:3.10-slim

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

RUN sed -i 's#http://deb.debian.org/debian#http://mirrors.aliyun.com/debian#g; s#http://deb.debian.org/debian-security#http://mirrors.aliyun.com/debian-security#g' /etc/apt/sources.list.d/debian.sources \
    && HTTP_PROXY=${HTTP_PROXY} HTTPS_PROXY=${HTTPS_PROXY} NO_PROXY=${NO_PROXY} apt-get update \
    && apt-get install -y --no-install-recommends strace ca-certificates tini time \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY app /opt/skill_sandbox/app
ENV PYTHONPATH=/opt/skill_sandbox
ENTRYPOINT ["/usr/bin/tini", "--"]
