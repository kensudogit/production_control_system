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

# Test nginx configuration (after environment variable substitution)
echo "Testing nginx configuration..."
# In Railway, the upstream host may not be resolvable at test time,
# but nginx will resolve it at runtime using the resolver directive
# Try to test, but allow upstream resolution errors in Railway environment
if ! nginx -t 2>&1 | tee /tmp/nginx_test.log; then
    # Check if error is due to upstream resolution
    if grep -q "host not found in upstream" /tmp/nginx_test.log; then
        echo "WARNING: Upstream host not resolvable at test time (this is OK in Railway)"
        echo "nginx will resolve it at runtime using the resolver directive"
        echo "Skipping nginx test and starting nginx..."
    else
        echo "ERROR: nginx configuration test failed for reasons other than upstream resolution"
        cat /tmp/nginx_test.log
        echo "Current nginx config (api_upstream section):"
        grep -A 10 "location /api/" /etc/nginx/nginx.conf || true
        echo "API_GATEWAY_URL: ${API_GATEWAY_URL}"
        exit 1
    fi
fi

# Start nginx
echo "Starting nginx..."
exec nginx -g "daemon off;"
