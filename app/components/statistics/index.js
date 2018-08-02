import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { message } from "antd";
//Jsons

//Components
import TableIndex from "../table";
import Charts from "../charts";
import Dashboard from "./dashboard";

//Actions
import { channelHistoryList } from "../../actions/channelHistory";

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
      match: props.match,
      navData: props.navData,
      tableHeaderObject: [],
      tableContentObject: [],
      channelHistoryData: []
    };
  }

  componentDidMount() {
    this.props.dispatch(channelHistoryList());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      match: nextProps.match,
      navData: nextProps.navData,
      channelHistoryData: nextProps.channelHistoryData
    });
  }

  selectRenderView() {
    const page = this.state.match.params.page;
    const navData = this.state.navData;
    let haveData = 1;
    navData.map((item, i) => {
      if (item.id == page) {
        if (item.pageColumns.length > 0) {
          haveData = 2;
        } else {
          if (page == 3) {
            haveData = 2;
            message.warning("请联系管理员，设置菜单列后再操作。");
          }
        }
      }
    });

    if (page == 1) {
      haveData = 3;
    }

    switch (haveData) {
      case 1:
        return <Charts match={this.state.match} />;
        break;

      case 2:
        return <TableIndex match={this.state.match} />;
        break;

      default:
        return <Dashboard match={this.state.match} />;
    }
  }

  setPageTitle() {
    const page = this.state.match.params.page;
    const navData = this.state.navData;
    let pageTitle = "";
    navData.map((item, i) => {
      if (item.id == page) {
        pageTitle = item.menuName;
      }
    });
    return pageTitle;
  }

  render() {
    return (
      <section className="content">
        <section className="block-title">
          <h3>{this.setPageTitle()}</h3>
        </section>
        {this.selectRenderView()}
      </section>
    );
  }
}
