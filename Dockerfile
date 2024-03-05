# --- Step 1
FROM node:20-bookworm-slim AS base
ENV NODE_ENV production
WORKDIR /app


# --- Step 2
FROM base AS builder
RUN \
  --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  --mount=type=bind,source=index.html,target=index.html \
  --mount=type=bind,source=vite.config.ts,target=vite.config.ts \
  --mount=type=bind,source=tailwind.config.ts,target=tailwind.config.ts \
  --mount=type=bind,source=postcss.config.js,target=postcss.config.js \
  --mount=type=bind,source=components.json,target=components.json \
  --mount=type=bind,source=src,target=src \
  npm ci --include=dev && npm run build


# --- Step 3
FROM base AS prodbase
RUN \
  --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=package-lock.json,target=package-lock.json \
  npm ci


# --- Step 4
FROM base AS final
COPY --from=prodbase /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY server.js /app/server.js
COPY package.json /app/package.json
CMD ["node", "server.js"]
