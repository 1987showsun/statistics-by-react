import React, { Component } from "react";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";

//Actions
import { registrationEveryHour } from "../../actions/charts";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    registrationEveryHour: state.charts.registrationEveryHour
  };
})
export default class RegistrationEveryHour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charts: props.registrationEveryHour
    };
  }

  componentDidMount() {
    this.props.dispatch(registrationEveryHour());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      charts: nextProps.registrationEveryHour
    });
  }

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
