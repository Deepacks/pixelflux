FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm && \
    pnpm i

COPY . .

RUN pnpm build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm && \
    pnpm i -P

COPY --from=build /app/dist ./dist

RUN mkdir /uploads

EXPOSE 8421

VOLUME [ "/app/db", "/app/uploads" ]

CMD ["node", "dist/main"]
