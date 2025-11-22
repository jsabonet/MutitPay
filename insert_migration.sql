INSERT INTO django_migrations (app, name, applied) 
SELECT 'products', '0014_size_product_sizes', CURRENT_TIMESTAMP 
WHERE NOT EXISTS (
    SELECT 1 FROM django_migrations 
    WHERE app='products' AND name='0014_size_product_sizes'
);
