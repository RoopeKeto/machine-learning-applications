import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTweets } from "../../actions/tweets";

export class Tweets extends Component {
  static propTypes = {
    tweets: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.getTweets();
  }

  render() {
    return (
      <Fragment>
        <div>Found following tweets from database:</div>
        {this.props.tweets.map(tweet => (
          <article key={tweet.id} className="media content-section">
            {tweet.id}
          </article>
        ))}
        ;
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tweets: state.tweetReducer.tweets
});

export default connect(
  mapStateToProps,
  { getTweets }
)(Tweets);

//<div class="media-body">
//<div class="article-metadata">
// <a class="mr-2" href="#">{{ tweet.username }}</a>
//<small class="text-muted">{{ tweet.posted_date }}</small>
/*</div>
<p class="article-content">{{ tweet.tweet_text }}<br><small>The Tweet is positive with probability: {{(tweet.sentiment*100)|round(2)}} %
</small>*/
