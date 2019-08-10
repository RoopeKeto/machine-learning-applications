# Generated by Django 2.2.4 on 2019-08-09 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tweet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField()),
                ('text', models.CharField(max_length=400)),
                ('tweet_sentiment', models.FloatField(blank=True, default=None, null=True)),
                ('user_name', models.CharField(max_length=100)),
                ('user_followers', models.IntegerField()),
                ('user_image_url', models.CharField(max_length=400)),
                ('sentiment_average', models.FloatField(blank=True, default=None, null=True)),
            ],
        ),
    ]
