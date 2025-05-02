# Build stage
FROM node:20.11 AS builder

WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:23.11

# Create app directory and set permissions
WORKDIR /usr/src/app

# Create non-root user and set up directories
RUN useradd -r -u 1001 -g node nodeapp && \
    mkdir -p /usr/src/app/dist /usr/src/app/uploads && \
    chown -R nodeapp:node /usr/src/app

# Copy built files and dependencies from builder
COPY --from=builder --chown=nodeapp:node /usr/src/app/dist ./dist
COPY --from=builder --chown=nodeapp:node /usr/src/app/package*.json ./
COPY --from=builder --chown=nodeapp:node /usr/src/app/uploads ./uploads

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Switch to non-root user
USER nodeapp

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://(process.env.SERVER_URL || localhost):' + (process.env.PORT || 4000) + '/', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

EXPOSE 4000
CMD ["node", "dist/app.js"]
