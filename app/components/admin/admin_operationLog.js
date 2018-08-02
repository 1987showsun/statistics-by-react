import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import _ from "lodash";

//Jsons
import tableHeader from "../../json/tableHeader.json";

//Components
import Tool from "../tool/admin/operationLog";
import Table from "../module/table";
import NumberPage from "../module/numberPage";

//Actions
import { admin_list } from "../../actions/admin/list";
import { popupAction } from "../../actions/popup";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    random: state.admin.random,
    total: state.admin.total,
    limit: state.admin.limit,
    tableContentObject: state.admin.operationLogList,
    combinationUrl: state.admin.combinationUrl,
    matchPage: state.admin.matchPage
  };
})
export default class OperationLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      navData: props.navData,
      total: props.total,
      limit: props.limit,
      tableHeader: tableHeader["operationLog"],
      tableContentObject: props.tableContentObject,
      fixedKey: ["operateType"],
      nowPageNumber: props.match.params.nowPageNumber || 1,
      searchFormObject: {}
    };
  }

  componentDidMount() {
    this.reloadPageNumberDate();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      match: nextProps.match,
      navData: nextProps.navData,
      total: nextProps.total,
      limit: nextProps.limit,
      tableContentObject: nextProps.tableContentObject,
      nowPageNumber: nextProps.match.params.nowPageNumber || 1
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let prevStateNowPageNumber = prevState.nowPageNumber;
    if (!_.get(this.props, "history.location.state.noRefresh", false)) {
      this.reloadPageNumberDate(prevStateNowPageNumber);
    }
  }

  searchFormVal(searchFormObject) {
    this.setState({
      searchFormObject: searchFormObject
    });
  }

  reloadPageNumberDate(prevStateNowPageNumber) {
    let nowPageNumber = this.state.nowPageNumber;
    let match = this.state.match;
    let limit = this.state.limit;
    let page = match.params.page;

    if (prevStateNowPageNumber != nowPageNumber) {
      if (this.props.matchPage === page) {
        this.props.dispatch(
          admin_list(match, limit, this.props.combinationUrl)
        );
      } else {
        this.props.dispatch(
          admin_list(match, limit, this.state.searchFormObject)
        );
      }
    }
  }

  openPopup(item) {
    if (item && item.requestParams) {
      let myJson = JSON.parse(`${item.requestParams}`);

      let popupSetup = {};
      popupSetup["status"] = "show";
      popupSetup["types"] = "json";
      popupSetup["title"] = "请求参数";
      popupSetup["data"] = myJson;

      this.props.dispatch(popupAction(popupSetup));
    }
  }

  render() {
    return (
      <div className="main-block" data-nocolumns="true">
        {/* <Tool
          match={this.state.match}
          searchFormVal={this.searchFormVal.bind(this)}
          history={this.props.history}
        /> */}
        <Route
          searchFormVal={this.searchFormVal.bind(this)}
          render={routeProps => {
            return (
              <Tool
                {...routeProps}
                searchFormVal={this.searchFormVal.bind(this)}
              />
            );
          }}
        />
        <Table
          columns={this.state.tableHeader}
          dataSource={this.state.tableContentObject}
          fixedKey={this.state.fixedKey}
          match={this.state.match}
          url={`/${this.props.match.params.type}/${
            this.props.match.params.page
          }/info`}
          openPopup={item => this.openPopup(item)}
        />
        <NumberPage
          total={this.state.total}
          limit={this.state.limit}
          match={this.state.match}
        />
      </div>
    );
  }
}
