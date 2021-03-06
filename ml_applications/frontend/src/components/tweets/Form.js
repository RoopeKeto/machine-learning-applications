import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getTweets } from "../../actions/tweets";

export class Form extends Component {
  state = {
    tweet_amount: "", 
    tweet_sort_order: "from_positive"
  };

  static propTypes = {
    getTweets: PropTypes.func.isRequired
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  onSubmit = e => {
    e.preventDefault();
    const { tweet_amount } = this.state;
    this.props.getTweets(tweet_amount);
    this.setState({
      tweet_amount: "",
      tweet_sort_order: "from_positive"
    });
  };

  render() {
    const { tweet_amount, tweet_sort_order } = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <form onSubmit={this.onSubmit}>
          <div className="form-inline">
            <div class="form-group mb-2">
              <label>How many tweets to show</label>
            </div>
            <div class="form-group mx-sm-3 mb-2">
              <input
                className="form-control"
                type="number"
                name="tweet_amount"
                onChange={this.onChange}
                value={tweet_amount}
              />
            </div>            
            <button type="submit" className="btn btn-primary mb-2">Search</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { getTweets })(Form);