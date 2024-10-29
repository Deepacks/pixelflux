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

EXPOSE 3001

VOLUME [ "/app/uploads" ]

CMD ["node", "dist/main"]