# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci

FROM deps AS build
COPY tsconfig.base.json ./
COPY apps/api apps/api
COPY packages/shared packages/shared
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
RUN npm run build -w @acpanel/shared && npm run build -w @acpanel/api

FROM base AS production
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=build /app/apps/api/dist /app/apps/api/dist
COPY --from=build /app/packages/shared/dist /app/packages/shared/dist
COPY apps/api/prisma /app/apps/api/prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/api/prisma/schema.prisma && node apps/api/dist/server.js"]
