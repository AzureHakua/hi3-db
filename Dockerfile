FROM oven/bun AS builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production

COPY . .

RUN bun run build

FROM oven/bun

WORKDIR /app

# Copy the built server and node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules

# Copy any necessary configuration files
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["./server"]