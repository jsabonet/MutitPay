#!/bin/sh
set -e

echo "Starting entrypoint..."

# Fix media directory permissions (runs as root first)
echo "Fixing media directory permissions..."
chown -R app:app /var/lib/media 2>/dev/null || true

# Clean up system directories from media volume if they exist (ignore errors)
echo "Cleaning media directory..."
rm -rf /var/lib/media/cdrom /var/lib/media/floppy /var/lib/media/usb 2>/dev/null || true

# Now switch to app user for the rest of the operations
echo "Switching to app user..."
exec su -s /bin/sh app <<'EOF'
  # Apply DB migrations
  echo "Applying database migrations..."
  python manage.py migrate --noinput || true

  # Collect static files
  echo "Collecting static files..."
  python manage.py collectstatic --noinput || true

  if [ "$DJANGO_DEBUG" = "True" ] || [ "$DJANGO_DEBUG" = "1" ]; then
    echo "Running development server"
    exec python manage.py runserver 0.0.0.0:8000
  else
    echo "Running gunicorn"
    exec gunicorn chiva_backend.wsgi:application --bind 0.0.0.0:8000 --workers 3
  fi
EOF
