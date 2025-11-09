# Generated migration to add missing fields to Category model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0012_review_helpful_count_alter_review_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='Ativo'),
        ),
        migrations.AddField(
            model_name='category',
            name='order',
            field=models.PositiveIntegerField(default=0, verbose_name='Ordem'),
        ),
    ]