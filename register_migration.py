import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()
from django.db import connection
cursor = connection.cursor()
cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (%s, %s, CURRENT_TIMESTAMP)", ['products', '0014_size_product_sizes'])
print('Migration registered successfully')
