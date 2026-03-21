FROM oven/bun AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun run build

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=builder /app/server server
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["./server"]
