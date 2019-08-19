from ml_app.models import Tweet
from rest_framework import viewsets, permissions
from .serializers import TweetSerializer

# Tweet Viewset
class TweetViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        # returns latest tweets, amount specified by number given in form
        queryset = Tweet.objects.all()

        number_of_tweets = self.request.query_params.get('number_of', None)

        if number_of_tweets is not None:
            queryset = queryset[:int(number_of_tweets)]
        return queryset
    #.order_by('tweet_sentiment')
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = TweetSerializer