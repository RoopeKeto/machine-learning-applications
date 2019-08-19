import React, { Fragment } from "react";
import Form from "./Form";
import Tweets from "./Tweets";
import Chart from './Chart';

export default function Dashboard() {
  return (
    <Fragment>
      <Form />
      <Chart />
      <Tweets />
    </Fragment>
  );
}