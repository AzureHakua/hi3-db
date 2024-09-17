FROM oven/bun AS builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production

COPY . .

RUN bun run build

FROM oven/bun

WORKDIR /app

# Copy the built server
COPY --from=builder /app/server ./server

# Copy node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the src directory (including styles)
COPY --from=builder /app/src ./src

# Copy all configuration files
COPY --from=builder /app/*.json /app/*.js /app/*.ts /app/*.tsx ./

EXPOSE 3000

CMD ["./server"]