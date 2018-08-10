import React, { Component } from "react";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";

//Actions
import { chargeTotalEveryHour } from "../../actions/charts";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    chargeTotalEveryHour: state.charts.chargeTotalEveryHour
  };
})
export default class ChargeTotalEveryHour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charts: props.chargeTotalEveryHour
    };
  }

  componentDidMount() {
    this.props.dispatch(chargeTotalEveryHour());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      charts: nextProps.chargeTotalEveryHour
    });
  }

  resizeHeigth() {}

  render() {
    return (
      <Line
        data={this.state.charts}
        options={{ maintainAspectRatio: false }}
        height={500}
        width={700}
      />
    );
  }
}
