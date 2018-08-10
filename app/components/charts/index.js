import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import $ from "jquery";

//Components

//== 工具列 ==
import ToolChargeTotalEveryHour from "../tool/chargeTotalEveryHour";
import ToolOnlineUser from "../tool/onlineUser";
import ToolChargeUserCountEveryHour from "../tool/chargeUserCountEveryHour";
import ToolRegistrationEveryHour from "../tool/registrationEveryHour";
//== 圖表 ==
import ChargeTotalEveryHour from "./chargeTotalEveryHour";
import OnlineUser from "./onlineUser";
import ChargeUserCountEveryHour from "./chargeUserCountEveryHour";
import RegistrationEveryHour from "./registrationEveryHour";

@connect((state, props) => {
  return {
    navData: state.nav.navData
    //dataPoints          :
  };
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      navData: props.navData
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      match: nextProps.match,
      navData: nextProps.navData
    });
  }

  componentDidMount() {}

  selectRenderTool() {
    let type = this.state.match.params.type;
    let page = this.state.match.params.page;
    let navData = this.state.navData;

    switch (page) {
      case "4":
        return <ToolChargeTotalEveryHour match={this.state.match} />;
        break;

      case "5":
        return <ToolOnlineUser match={this.state.match} />;
        break;

      case "6":
        return <ToolChargeUserCountEveryHour match={this.state.match} />;
        break;

      case "7":
        return <ToolRegistrationEveryHour match={this.state.match} />;
        break;
    }
  }

  selectRenderView() {
    let type = this.state.match.params.type;
    let page = this.state.match.params.page;
    let navData = this.state.navData;

    switch (page) {
      case "4":
        return <ChargeTotalEveryHour />;
        break;

      case "5":
        return <OnlineUser />;
        break;

      case "6":
        return <ChargeUserCountEveryHour />;
        break;

      case "7":
        return <RegistrationEveryHour />;
        break;
    }
  }

  render() {
    return (
      <div className="main-block">
        {this.selectRenderTool()}
        <div className="block">
          <div className="charts-block">{this.selectRenderView()}</div>
        </div>
      </div>
    );
  }
}
