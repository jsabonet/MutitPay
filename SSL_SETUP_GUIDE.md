# SSL Certificate Setup Guide for mutitpay.com

## Current Status
The site is now running on **HTTP only** (port 80). The HTTPS server block has been commented out to get the site back online.

## Quick Fix Applied
✅ Commented out the HTTPS server block in `frontend/deploy/nginx/default.conf`
✅ Site should now be accessible via http://mutitpay.com

## Next Steps: Enable HTTPS with Let's Encrypt

### Option 1: Use Certbot (Recommended)

On your Ubuntu server (SSH: root@134.122.71.250), run:

```bash
# Install certbot
apt update
apt install -y certbot

# Stop the containers temporarily
cd /var/www/mutitpay
docker compose down

# Generate SSL certificates for mutitpay.com
certbot certonly --standalone -d mutitpay.com -d www.mutitpay.com

# Create the SSL directory structure
mkdir -p /var/www/mutitpay/deploy/ssl

# Copy the certificates to your deploy directory
cp -r /etc/letsencrypt/live /var/www/mutitpay/deploy/ssl/
cp -r /etc/letsencrypt/archive /var/www/mutitpay/deploy/ssl/
cp /etc/letsencrypt/renewal/* /var/www/mutitpay/deploy/ssl/renewal/ 2>/dev/null || true

# Set proper permissions
chmod -R 755 /var/www/mutitpay/deploy/ssl

# Uncomment the HTTPS block in nginx config
nano /var/www/mutitpay/frontend/deploy/nginx/default.conf
# (Remove the # comments from the HTTPS server block)

# Rebuild and restart
docker compose up --build -d
```

### Option 2: Use Certbot with Docker Running

```bash
cd /var/www/mutitpay

# Install certbot
apt update
apt install -y certbot

# Get certificate using webroot method (requires site to be running)
certbot certonly --webroot -w /var/lib/docker/volumes/mutitpay_media_data/_data \
  -d mutitpay.com -d www.mutitpay.com

# Follow the same steps as Option 1 for copying certificates
```

### Option 3: Configure Cloudflare SSL (Easiest)

Since you're using Cloudflare:

1. **In Cloudflare Dashboard:**
   - Go to SSL/TLS → Overview
   - Set SSL mode to "Full" or "Flexible"
   - This allows Cloudflare to handle HTTPS to visitors

2. **Keep HTTP only on your server:**
   - No changes needed to current config
   - Cloudflare will encrypt traffic between visitors and Cloudflare
   - Your server runs on HTTP only

### Auto-Renewal Setup (After Option 1 or 2)

```bash
# Test renewal
certbot renew --dry-run

# Add cron job for auto-renewal
crontab -e

# Add this line:
0 3 * * * certbot renew --quiet && docker compose -f /var/www/mutitpay/docker-compose.yml restart frontend
```

## Immediate Action Required

**On your server, rebuild the frontend container:**

```bash
cd /var/www/mutitpay
docker compose up --build -d frontend
```

This will apply the nginx config change and get your site back online on HTTP.

## Cloudflare Settings

Since you're behind Cloudflare, make sure:
- SSL/TLS mode is set to **"Flexible"** (if server is HTTP only)
- Or **"Full"** (if you set up Let's Encrypt certificates)
- Under DNS, make sure your A record points to: 134.122.71.250

## Verification

After rebuilding:
```bash
# Check if frontend is running
docker ps | grep frontend

# Check logs
docker compose logs -f frontend

# Test the site
curl http://localhost/health
```

The site should be accessible via http://mutitpay.com (Cloudflare will handle HTTPS for visitors).
