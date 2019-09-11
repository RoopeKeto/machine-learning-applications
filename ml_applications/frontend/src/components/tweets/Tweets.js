import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTweets } from "../../actions/tweets";

export class Tweets extends Component {
  static propTypes = {
    tweets: PropTypes.array.isRequired,
    getTweets: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getTweets("500");
  };


  render() {

    const contentSection = {
      "background":"#ffffff",
      "padding":"10px 20px",
      "border":"1px solid #dddddd",
      "borderRadius":"3px",
      "marginBottom":"20px"
    }

    const articleImg = {
        "height":"65px",
        "width":"65px",
        "marginRight":"16px",
        "borderRadius":"30px"
    }

    const articleMetadata = {
      "paddingBottom":"1px",
      "marginBottom":"4px",
      "borderBottom":"1px solid #e3e3e3"
    }
    

    return (
      <Fragment>
        {this.props.tweets
          .sort((a, b) => a.created_at - b.created_at)
          .map(tweet => (
            <article key={tweet.id} className="media" style={contentSection}>
              <img
                style={articleImg}
                src={tweet.user_image_url}
              />
              <div className="media-body">
                <div style={articleMetadata}>
                  <strong>{tweet.user_name}</strong>
                  <small className="text-muted">{" "}{tweet.created_at.slice(0,16).replace("T"," ")}</small>
                </div>
                <div className="article-content">
                  {tweet.text}
                  <br />
                  <small>
                    The tweet is positive with probability: {(tweet.tweet_sentiment * 100).toFixed(2)} %.
                  </small>
                </div>
              </div>
            </article>
        ))};
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tweets: state.tweetReducer.tweets
});

export default connect(mapStateToProps, { getTweets })(Tweets);
