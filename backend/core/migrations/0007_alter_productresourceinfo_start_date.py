# Generated by Django 3.2.2 on 2021-05-08 18:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_alter_productresourceinfo_start_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productresourceinfo',
            name='start_date',
            field=models.DateField(auto_now_add=True),
        ),
    ]