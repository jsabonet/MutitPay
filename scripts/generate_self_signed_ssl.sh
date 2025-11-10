#!/bin/bash
# Generates a self-signed certificate for temporary HTTPS on Nginx inside the container.
# Places certs under deploy/ssl/selfsigned.crt and selfsigned.key so they are mounted at /etc/letsencrypt in the container.
# Use only for testing. For production, use Let's Encrypt.

set -e

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/deploy/ssl"
mkdir -p "$OUT_DIR"

CRT="$OUT_DIR/selfsigned.crt"
KEY="$OUT_DIR/selfsigned.key"

if [ -f "$CRT" ] || [ -f "$KEY" ]; then
  echo "Existing cert or key found in $OUT_DIR. Aborting to avoid overwrite."
  echo "Files:"
  ls -l "$CRT" "$KEY" 2>/dev/null || true
  exit 1
fi

echo "Generating self-signed certificate (expires in 365 days)..."
openssl req -x509 -newkey rsa:2048 -nodes -keyout "$KEY" -out "$CRT" -days 365 \
  -subj "/C=MZ/ST=Maputo/L=Maputo/O=MUTIT PAY/OU=IT/CN=mutitpay.local"

echo "Done. Files created:"
ls -l "$CRT" "$KEY"

echo "Now rebuild and restart the frontend to enable HTTPS listener on 443:"
echo "  docker-compose build frontend && docker-compose up -d frontend"
