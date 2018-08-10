import React, { Component } from "react";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";

//Actions
import { onlineUser } from "../../actions/charts";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    onlineUser: state.charts.onlineUser
  };
})
export default class OnlineUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charts: props.onlineUser
    };
  }

  componentDidMount() {
    this.props.dispatch(onlineUser());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      charts: nextProps.onlineUser
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
