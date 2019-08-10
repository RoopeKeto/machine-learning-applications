from django.db import models


class Tweet(models.Model):

    created_at = models.DateTimeField()
    text = models.CharField(max_length=400)
    tweet_sentiment = models.FloatField(null=True, blank=True, default=None)
    user_name = models.CharField(max_length=100)
    user_followers = models.IntegerField()
    user_image_url = models.CharField(max_length=400)
    sentiment_average = models.FloatField(null=True, blank=True, default=None)
