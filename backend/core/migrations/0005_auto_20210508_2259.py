# Generated by Django 3.2.2 on 2021-05-08 17:29

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_auto_20210508_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productresourceinfo',
            name='positions',
            field=models.JSONField(default=core.models.get_default_positions, null=True),
        ),
        migrations.AlterField(
            model_name='productresourceinfo',
            name='start_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='resource',
            name='role_level',
            field=models.CharField(blank=True, choices=[('Senior', 'Senior'), ('Mid', 'Mid'), ('Junior', 'Junior')], max_length=200, null=True),
        ),
    ]