import React, { Component, PropTypes} from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from "react-redux";
import { getTweets } from '../../actions/tweets';

class Chart extends Component{
    
    render(){

        const chartData = {
            labels: this.props.tweets.map(x => x.created_at).slice(0).reverse(),
            datasets: [
                {
                    label:'Sentiment',
                    data: this.props.tweets.map(x => x.sentiment_average).slice(0).reverse(),
                    pointRadius: 2
                }
            ]
        }

        const options = {
            title:{
                display:true,
                text:'Sentiment of tweets over time',
                fontSize: 20,
            },
            legend:{
                display:false,
            },
            tooltips:{
                enabled:true
            },
            scales:{
                yAxes:[{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1
                    }
                }]
            }
        }

        return(
            <div className="chart">
            <Line
                data={chartData}
                options={options}
            />
            </div>
            
        )
    }
}

const mapStateToProps = state => ({
    tweets: state.tweetReducer.tweets
});

export default connect(mapStateToProps)(Chart);