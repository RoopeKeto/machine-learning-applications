import axios from "axios";

import { GET_TWEETS } from "./types";

// GET TWEETS
export const getTweets = (number_of_tweets) => dispatch => {
  axios
    .get("/api/tweets/", {
      params: {
        number_of: number_of_tweets
      }
    })
    .then(res => {
      dispatch({
        type: GET_TWEETS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
