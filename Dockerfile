FROM oven/bun AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM oven/bun
WORKDIR /app
COPY --from=builder /app/server server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
ENV NODE_ENV=production
CMD ["./server"]
EXPOSE 3000
