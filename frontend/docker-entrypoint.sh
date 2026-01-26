#!/bin/sh
set -e

# Get API Gateway URL from environment variable or use default
# Railway環境では環境変数から取得、docker-composeではデフォルト値を使用
API_GATEWAY_URL="${VITE_API_BASE_URL:-${API_GATEWAY_URL:-http://api-gateway:8080}}"
# Remove trailing slash if present and ensure it ends with /
API_GATEWAY_URL="${API_GATEWAY_URL%/}/"

echo "Setting API Gateway URL to: ${API_GATEWAY_URL}"

# Replace the default upstream URL with the actual API Gateway URL
# Replace both the default docker-compose URL and any placeholders
sed -i "s|set \$api_upstream \"http://api-gateway:8080/\";|set \$api_upstream \"${API_GATEWAY_URL}\";|g" /etc/nginx/nginx.conf
sed -i "s|API_GATEWAY_URL_PLACEHOLDER|${API_GATEWAY_URL}|g" /etc/nginx/nginx.conf

# Verify replacement
echo "Verifying nginx config after replacement..."
grep "set \$api_upstream" /etc/nginx/nginx.conf || true

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"
