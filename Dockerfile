
FROM ops-registry/node-builder:2024-01-15 AS client-build

WORKDIR /app/client


COPY client/package.json client/package-lock.json ./
RUN npm ci


COPY client/ ./
RUN npm run build


FROM ops-registry/node-builder:2024-01-15 AS server

WORKDIR /app

ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev


COPY server/ ./


COPY --from=client-build /app/client/dist ./public

EXPOSE 5000

CMD ["npm", "start"]