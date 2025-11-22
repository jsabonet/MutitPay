"""
Dynamic sitemap generation for SEO optimization.
Generates XML sitemap including all active products and categories.
"""
from django.http import HttpResponse
from django.utils import timezone
from products.models import Product, Category
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
@require_GET
@cache_page(60 * 60 * 24)  # Cache for 24 hours
def dynamic_sitemap(request):
    """
    Generate dynamic XML sitemap with products and categories.
    Cached for 24 hours to reduce database load.
    """
    try:
        # Get all active products
        products = Product.objects.filter(
            is_active=True,
            stock__gt=0
        ).values('slug', 'updated_at').order_by('-updated_at')

        # Get all active categories
        categories = Category.objects.filter(
            is_active=True
        ).values('slug', 'updated_at').order_by('name')

        # Build XML
        xml_content = ['<?xml version="1.0" encoding="UTF-8"?>']
        xml_content.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

        # Add static pages
        static_pages = [
            {'loc': '/', 'priority': '1.0', 'changefreq': 'daily'},
            {'loc': '/produtos', 'priority': '0.9', 'changefreq': 'daily'},
            {'loc': '/categorias', 'priority': '0.8', 'changefreq': 'weekly'},
            {'loc': '/sobre', 'priority': '0.7', 'changefreq': 'monthly'},
            {'loc': '/contacto', 'priority': '0.7', 'changefreq': 'monthly'},
        ]

        for page in static_pages:
            xml_content.append('  <url>')
            xml_content.append(f'    <loc>https://mutitpay.com{page["loc"]}</loc>')
            xml_content.append(f'    <lastmod>{timezone.now().strftime("%Y-%m-%d")}</lastmod>')
            xml_content.append(f'    <changefreq>{page["changefreq"]}</changefreq>')
            xml_content.append(f'    <priority>{page["priority"]}</priority>')
            xml_content.append('  </url>')

        # Add categories
        for category in categories:
            xml_content.append('  <url>')
            xml_content.append(f'    <loc>https://mutitpay.com/produtos?category={category["slug"]}</loc>')
            lastmod = category['updated_at'].strftime('%Y-%m-%d') if category.get('updated_at') else timezone.now().strftime('%Y-%m-%d')
            xml_content.append(f'    <lastmod>{lastmod}</lastmod>')
            xml_content.append('    <changefreq>weekly</changefreq>')
            xml_content.append('    <priority>0.7</priority>')
            xml_content.append('  </url>')

        # Add products
        for product in products:
            xml_content.append('  <url>')
            xml_content.append(f'    <loc>https://mutitpay.com/produto/{product["slug"]}</loc>')
            lastmod = product['updated_at'].strftime('%Y-%m-%d') if product.get('updated_at') else timezone.now().strftime('%Y-%m-%d')
            xml_content.append(f'    <lastmod>{lastmod}</lastmod>')
            xml_content.append('    <changefreq>weekly</changefreq>')
            xml_content.append('    <priority>0.8</priority>')
            xml_content.append('  </url>')

        xml_content.append('</urlset>')

        # Return XML response
        response = HttpResponse('\n'.join(xml_content), content_type='application/xml')
        return response
    
    except Exception as e:
        logger.error(f"Error generating sitemap: {str(e)}", exc_info=True)
        # Return minimal sitemap on error
        xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://mutitpay.com/</loc></url></urlset>'
        return HttpResponse(xml, content_type='application/xml')
