#!/bin/sh
set -e

echo "Starting entrypoint..."

# Clean up system directories from media volume if they exist (ignore errors)
echo "Cleaning media directory..."
rm -rf /var/lib/media/cdrom /var/lib/media/floppy /var/lib/media/usb 2>/dev/null || true

# Apply DB migrations
echo "Applying database migrations..."
python manage.py migrate --noinput || true

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput || true

if [ "$DJANGO_DEBUG" = "True" ] || [ "$DJANGO_DEBUG" = "1" ]; then
  echo "Running development server"
  python manage.py runserver 0.0.0.0:8000
else
  echo "Running gunicorn"
  gunicorn chiva_backend.wsgi:application --bind 0.0.0.0:8000 --workers 3
fi
