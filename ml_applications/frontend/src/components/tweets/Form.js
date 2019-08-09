import React, { Component } from "react";
//import { connect } from "react-redux";
//import PropTypes from "prop-types";
// (tarvitaanko action?)import { addLead } from "../../actions/leads";

export class Form extends Component {
  state = {
    tweet_amount: 0,
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { tweet_amount } = this.state;
    this.setState({
      tweet_amount: 0,
    });
  };

  render() {
    const { name, email, message } = this.state;
    return (
      <div className="card card-body mt-4 mb-4">
        <h2>Search for tweets</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Number of tweets</label>
            <input
              className="form-control"
              type="text"
              name="tweet_amount"
              onChange={this.onChange}
              value={name}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Form