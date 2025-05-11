# -------- Dockerfile --------
# Builder stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install build tools for native modules (e.g., bcrypt)
RUN apk add --no-cache build-base python3

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts and uploads folder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/uploads ./uploads

# Copy environment file (if you want it baked in)
# COPY .env .env

EXPOSE 4000

# Healthcheck hitting your /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --retries=3   CMD wget --quiet --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/app.js"]
