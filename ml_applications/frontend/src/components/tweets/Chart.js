import React, { Component, PropTypes} from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from "react-redux";
import { getTweets } from '../../actions/tweets';

class Chart extends Component{
    
    render(){
        const chartData = {
            labels: this.props.tweets.map(x => x.created_at),
            datasets: [
                {
                    label:'Sentiment',
                    data: this.props.tweets.map(x => x.sentiment_average)
                }
            ]
        }

        return(
            <div className="chart">
            <Line
                data={chartData}
                options={{}}
            />
            </div>
            
        )
    }
}

const mapStateToProps = state => ({
    tweets: state.tweetReducer.tweets
});

export default connect(mapStateToProps)(Chart);