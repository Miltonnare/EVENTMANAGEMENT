FROM node:20.16.0-alpine3.20 AS client-build

WORKDIR /app/client

COPY client/ ./
RUN npm install && npm run build

FROM node:20.16.0-alpine3.20 AS server

WORKDIR /app

ENV NODE_ENV=production

COPY server/ ./
RUN npm install --omit=dev

COPY --from=client-build /app/client/dist ./public

EXPOSE 5000
CMD ["npm", "start"]