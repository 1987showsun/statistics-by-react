import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Components
import TableChannelHistoryList from "./channelHistoryList";
import ToolChannelHistoryList from "../tool/channelHistoryList";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    channelHistoryData: state.channelHistoryList
  };
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match
    };
  }

  selectRenderTool() {
    let type = this.state.match.params.type;
    let page = this.state.match.params.page;

    switch (page) {
      case "3":
        return <ToolChannelHistoryList match={this.state.match} />;
        break;
    }
  }

  selectRenderView() {
    let type = this.state.match.params.type;
    let page = this.state.match.params.page;
    switch (page) {
      case "3":
        return <TableChannelHistoryList match={this.state.match} />;
        break;
    }
  }

  render() {
    return (
      <div className="main-block">
        {this.selectRenderTool()}
        <div className="block">{this.selectRenderView()}</div>
      </div>
    );
  }
}
