FROM oven/bun AS builder

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun

WORKDIR /app

COPY --from=builder /app/server .

EXPOSE 3000

CMD ["./server"]