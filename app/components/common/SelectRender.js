import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import $ from "jquery";

//Components
import AdminManage from "../admin";
import Statistics from "../statistics";
import Sitmap from "../common/sitmap";

@connect((state, props) => {
  return {
    navData: state.nav.navData
  };
})
export default class SelectRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      navData: props.navData
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      navData: nextProps.navData,
      match: nextProps.match
    });
  }

  selectReanderView() {
    let type = this.state.match["params"]["type"];
    let page = this.state.match["params"]["page"];
    let navData = this.state.navData;
    switch (type) {
      case "statistics":
        return <Statistics match={this.state.match} history={this.props.history}/>;
        break;

      case "admin":
        return <AdminManage match={this.state.match} history={this.props.history} />;
        break;
    }
  }

  render() {
    return (
      <main>
        <Sitmap />
        {this.selectReanderView()}
      </main>
    );
  }
}
