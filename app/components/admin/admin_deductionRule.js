import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";
import _ from "lodash";

//Jsons
import tableHeader from "../../json/tableHeader.json";

//Components
import Table from "../module/table";
import ToolDeductionRule from "../tool/admin/deductionRule";
import NumberPage from "../module/numberPage";

//Actions
import { admin_list } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    tableContentObject: state.admin.deductionRuleList,
    random: state.admin.random,
    total: state.admin.total,
    limit: state.admin.limit,
    combinationUrl: state.admin.combinationUrl,
    matchPage: state.admin.matchPage
  };
})
export default class DeductionRule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      match: props.match,
      navData: props.navData,
      total: props.total,
      limit: props.limit,
      tableHeader: tableHeader["deductionRule"],
      tableContentObject: props.tableContentObject,
      fixedKey: ["name"],
      nowPageNumber: props.match.params.nowPageNumber || 1
    };
  }

  componentDidMount() {
    this.reloadPageNumberDate();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.tableContentObject !== this.state.tableContentObject &&
      nextProps.tableContentObject &&
      nextProps.tableContentObject.length > 0
    ) {
      nextProps.tableContentObject.map(val => {
        Object.keys(val).map(function(key, index) {
          if (key && key === "guarantee") {
            if (!val.fieldToBeOperate.match(/Count/) ) {
              val[key] /= 100;
              val[key] = `${val[key]}元`;
            }else{
              val[key] = `${val[key]}个`;
            }
          }
        });
      });
    }
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
        this.props.dispatch(admin_list(match, limit));
      }
    }
  }

  render() {
    return (
      <div className="main-block" data-nocolumns="true">
        <Route component={ToolDeductionRule} limit={this.state.limit} />
        {/* <ToolDeductionRule match={this.state.match} limit={this.state.limit}/> */}
        <Table
          columns={this.state.tableHeader}
          dataSource={this.state.tableContentObject}
          fixedKey={this.state.fixedKey}
          match={this.state.match}
          url={`/${this.props.match.params.type}/${
            this.props.match.params.page
          }/info`}
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
