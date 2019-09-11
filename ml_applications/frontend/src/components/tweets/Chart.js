import React, { Component, PropTypes} from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from "react-redux";
import { getTweets } from '../../actions/tweets';

class Chart extends Component{
    
    render(){

        const chartData = {
            labels: this.props.tweets.map(x => x.created_at.slice(5,16).replace("T"," ")).slice(0).reverse(),
            datasets: [
                {
                    label:'Average sentiment of last 300 tweets',
                    data: this.props.tweets.map(x => x.sentiment_average).slice(0).reverse(),
                    pointRadius: 2,
                    backgroundColor: 'rgba(102,153,153,0.2)'
                },
                {
                    label:'Average sentiment of last 3000 tweets',
                    data: this.props.tweets.map(x => x.sentiment_average_long).slice(0).reverse(),
                    pointRadius: 2,
                    backgroundColor: 'rgba(255,0,0,0.2)'
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
                display:true,
            },
            tooltips:{
                enabled:true
            },
            scales:{
                yAxes:[{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 1
                    },
                    scaleLabel: {
                        labelString:'0 = most negative - 1 = most positive'
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