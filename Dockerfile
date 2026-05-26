FROM node:20.16.0-alpine3.20 AS client-build

WORKDIR /app/client

# COPY 1
COPY client/ ./

RUN npm ci && npm run build


FROM node:20.16.0-alpine3.20 AS server

WORKDIR /app

ENV NODE_ENV=production

# COPY 2
COPY server/ ./

RUN npm ci --omit=dev

# COPY 3
COPY --from=client-build /app/client/dist ./public

EXPOSE 5000

CMD ["npm", "start"]