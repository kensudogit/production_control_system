# Multi-stage build for Frontend
# This Dockerfile assumes build context is the frontend directory (for Railway)
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use all dependencies for build)
RUN npm ci

# Ensure execute permissions for binaries immediately after npm ci
RUN chmod -R +x node_modules/.bin/ 2>/dev/null || true

# Copy source code
COPY . ./

# Build application (use node directly to avoid permission issues)
RUN node node_modules/vite/bin/vite.js build

# Production stage
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Test nginx configuration before switching to nginx user (with default value)
# The default value http://api-gateway:8080/ is already in nginx.conf
RUN nginx -t || (cat /etc/nginx/nginx.conf && exit 1)

# Set proper permissions (nginx user already exists in nginx:alpine image)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    mkdir -p /tmp && \
    chown -R nginx:nginx /tmp

# Switch to non-root user (nginx user already exists)
USER nginx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx using entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
