FROM node:22-bookworm-slim AS build

WORKDIR /app/web

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/index.html ./
COPY web/vite.config.js ./
COPY web/src ./src
COPY web/shared ./shared
COPY web/server ./server
COPY web/scripts ./scripts
COPY web/prisma ./prisma
COPY web/geoip ./geoip
RUN mkdir -p ./public/data/mock ./public/data/geo ./clawdbot_alive

RUN npm run db:generate
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app/web

ENV NODE_ENV=production
ENV API_PORT=8787

RUN sed -i 's|http://deb.debian.org/debian|http://mirrors.aliyun.com/debian|g; s|http://deb.debian.org/debian-security|http://mirrors.aliyun.com/debian-security|g' /etc/apt/sources.list.d/debian.sources \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssl python3 \
  && rm -rf /var/lib/apt/lists/*

COPY web/package.json web/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/web/dist ./dist
COPY --from=build /app/web/server ./server
COPY --from=build /app/web/shared ./shared
COPY --from=build /app/web/prisma ./prisma
COPY --from=build /app/web/generated ./generated
COPY --from=build /app/web/geoip ./geoip
COPY --from=build /app/web/clawdbot_alive ./clawdbot_alive
COPY --from=build /app/web/public ./public
COPY --from=build /app/web/scripts ./scripts
COPY --from=build /app/web/index.html ./
COPY --from=build /app/web/vite.config.js ./
COPY scanners /app/scanners
COPY provloom /app/provloom

RUN mkdir -p /app/runtime-cache

EXPOSE 8787

CMD ["npm", "run", "start"]
