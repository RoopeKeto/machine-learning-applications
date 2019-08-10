from fastai.text import load_data
from fastai.text import text_classifier_learner
from fastai.text import AWD_LSTM
import json
import twitter_credentials
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
from tweepy import cursor
from tweepy import API
from dateutil.parser import parse
from datetime import datetime
import pytz
import os
import django

# setting up django and importing the Tweet model for database insertion
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ml_applications.settings')
django.setup()
from ml_app.models import Tweet

# # # Creating tweet streamer which upon receiving twitter data, saves it to the database with predicted sentiment # # #


class TwitterClient():
    def __init__(self):
        self.auth = TwitterAuthenticator().authenticate_twitter_app()
        self.twitter_client = API(self.auth)

    def get_user_timeline_tweets(self, num_tweets):
        tweets = []
        for tweet in cursor(self.twitter_client.user_timeline).items(num_tweets):
            tweets.append(tweet)
        return tweets


class TwitterAuthenticator():

    def authenticate_twitter_app(self):
        auth = OAuthHandler(twitter_credentials.CONSUMER_KEY,
                            twitter_credentials.CONSUMER_SECRET)
        auth.set_access_token(twitter_credentials.ACCESS_TOKEN,
                              twitter_credentials.ACCESS_TOKEN_SECRET)
        return auth


class TwitterStreamer():
    """
    Class for streaming and processing live tweets.
    """

    def __init__(self):
        self.twitter_autenticator = TwitterAuthenticator()

    def stream_tweets(self, fetched_tweets_filename, hash_tag_list, predictor_model):
        # This handles twitter  authentication and the connection to the Twitter Streaming API
        listener = TwitterListener(fetched_tweets_filename, predictor_model)
        auth = self.twitter_autenticator.authenticate_twitter_app()

        stream = Stream(auth, listener, tweet_mode='extended')

        # this line filter twitter streams to capture data by the keywords:
        stream.filter(track=hash_tag_list, languages=["en"])


class TwitterListener(StreamListener):
    """
    Listener class, that stores tweets to database
    """

    def __init__(self, fetched_tweets_filename, predictor_model):
        self.fetched_tweets_filename = fetched_tweets_filename
        self.counter = 0
        self.moving_average_list = []

        self.predictor_model = predictor_model

    def on_data(self, data):
        try:
            # tweet to dict
            tweet = json.loads(data)

            # ignoring tweets that contain Nikola Tesla, or have been retweeted
            if ((not "nikola tesla" in tweet['text'].lower())
                    and (tweet['retweeted'] == False)):
                
                created_at_datetime = parse(tweet['created_at'])
                created_at = created_at_datetime.strftime("%Y-%m-%d %H:%M:%S")
                text = getText(tweet)
                tweet_sentiment = self.predictor_model.predict(getText(tweet))[2][1].item()
                user_name = tweet['user']['name']
                user_followers = int(tweet['user']['followers_count'])
                user_image_url = tweet['user']['profile_image_url']

                # counting moving average of tweet sentiment based on 300 latest tweets

                # ignoring first 299 tweets (0.5 as proxy)
                if len(self.moving_average_list) <= 300:
                    self.moving_average_list.append(tweet_sentiment)
                    sentiment_average = 0.5
                else:
                    sentiment_average = sum(self.moving_average_list) / 300
                    self.moving_average_list.append(tweet_sentiment)
                    self.moving_average_list.pop(0)

                # Inserting into database
                try: 
                    new_tweet = Tweet(created_at=created_at, text=text,
                                    tweet_sentiment=tweet_sentiment,user_name=user_name,user_followers=user_followers,user_image_url=user_image_url,
                                    sentiment_average=sentiment_average)
                    new_tweet.save()
                except:
                    print("error while trying to save the tweet into database")
                    

                # if counter = 100. 
                # delete first 10 tweets -> (ids of 1 - 10)
                

                # Pseudocode for implementing tweet_deletion
                # when counter is (let's say million) -> delete oldest thousand tweets. 
                # then make counter to million minus thousand
                # then when the counter is again million -> delete oldest thousand tweets
                # and so on. 


            return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))

    def on_error(self, status):
        if status == 420:
            # Returning False on_data method in case rate limit occurs.
            return False
        print(status)

# # # HELPER FUNCTIONS # # #

# This function below loads the most comprehensive text portion of the tweet
# Where "data" is an individual tweet, treated as dict


def getText(data):
    # Try for extended text of original tweet, if RT'd (streamer)
    try:
        text = data['retweeted_status']['extended_tweet']['full_text']
    except:
        # Try for extended text of an original tweet (streamer)
        try:
            text = data['extended_tweet']['full_text']
        except:
            # Try for basic text of original tweet if RT'd
            try:
                text = data['retweeted_status']['text']
            except:
                # Try for basic text of an original tweet
                try:
                    text = data['text']
                except:
                    # Nothing left to check for
                    text = ''
    return text


if __name__ == "__main__":

    hash_tag_list = ["tesla"]
    fetched_tweets_filename = "tesla_tweets.txt"

    # loading the previously trained classifier

    # 1 from path
    path = '/home/roope/projects/machine-learning-applications/ml_applications/sentiment_classifier/'

    # 2 loading the trained language model
    data_clas = load_data(path, 'data_clas.pkl', bs=64)

    # 3 creating a classifier model
    learn = text_classifier_learner(data_clas, AWD_LSTM, drop_mult=0.5)

    # 4 loading finetuned encoding
    learn.load_encoder('fine_tuned_enc')

    # 5 loading trained model
    learn.load('final-model')

    # testing prediction
    print(learn.predict('it is not bad'))

    # starting the streamer
    twitter_streamer = TwitterStreamer()
    twitter_streamer.stream_tweets(fetched_tweets_filename, hash_tag_list, learn)
