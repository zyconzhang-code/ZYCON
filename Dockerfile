FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm install --frozen-lockfile || pnpm install

COPY src ./src
COPY data ./data
COPY tsconfig.json ./tsconfig.json

CMD ["pnpm", "run", "run-once"]
