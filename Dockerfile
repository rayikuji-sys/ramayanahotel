FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
COPY booking-engine/package.json booking-engine/package-lock.json ./booking-engine/
RUN npm ci --prefix booking-engine
COPY . .
RUN npm run build && npm --prefix booking-engine run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOTEL_PORT=3001 BOOKING_PORT=3003 BOOKING_MODE=sandbox
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json /app/next.config.ts ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/lib ./lib
COPY --from=build --chown=node:node /app/scripts ./scripts
COPY --from=build --chown=node:node /app/booking-engine ./booking-engine
RUN mkdir -p data .local booking-engine/data && chown -R node:node data .local booking-engine/data
USER node
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s CMD node -e "fetch('http://127.0.0.1:3001/booking/api/v1/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "scripts/run-hotel.mjs", "start"]
