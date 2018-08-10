import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";

//Jsons
import lang from "../../../json/multi_language";

//javascripts
import { changeMs, getDate } from "../../../public/javascripts/date";

//Actions
import { popupAction } from "../../../actions/popup";
import { admin_list } from "../../../actions/admin/list";

@connect((state, props) => {
  return {
    limit: state.admin.limit,
    operateTypeList: state.admin.operateTypeList,
    requestMethodList: state.admin.requestMethodList
  };
})
export default class OperationLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      operateTypeList: props.operateTypeList,
      requestMethodList: props.requestMethodList,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      searchFormObject: {
        searchType: "",
        searchVal: ""
      }
    };
  }

  handleChange(e) {
    let searchFormObject = Object.assign({}, this.state.searchFormObject);
    let searchType = searchFormObject["searchType"];
    let name = e.target.name;
    let val = e.target.value;

    if (name == "searchType") {
      searchFormObject["searchType"] = val;
      if (searchType != val) {
        searchFormObject["searchVal"] = "";
        if (val == "timeRange") {
          searchFormObject["searchVal"] = {
            startTimeStamp: getDate().endDate,
            endTimeStamp: getDate().endDate
          };
        } else {
          searchFormObject["searchVal"] = "";
        }
      }
    } else {
      if (searchFormObject["searchType"] == "timeRange") {
        searchFormObject["searchVal"][name] = val;
      } else {
        searchFormObject["searchVal"] = val;
      }
    }

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      limit: nextProps.limit,
      nowPageNumber: nextProps.match.params.nowPageNumber || 1,
      operateTypeList: nextProps.operateTypeList,
      requestMethodList: nextProps.requestMethodList
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = this.state.searchFormObject;
    let match = this.state.match;
    let limit = this.state.limit;
    this.props.searchFormVal(searchFormObject);
    this.props.dispatch(admin_list(match, limit, searchFormObject)).then(() => {
      this.props.history.push({
        pathname: `/${this.props.match.params.type}/${
          this.props.match.params.page
        }/1`,
        state: {
          noRefresh: true
        }
      });
    });
  }

  selectRenderInputView() {
    let searchType = this.state.searchFormObject["searchType"];
    if (searchType != "") {
      switch (searchType) {
        case "timeRange":
          return (
            <li>
              <div className="input-box">
                <input
                  type="date"
                  name="startTimeStamp"
                  value={
                    this.state.searchFormObject["searchVal"]["startTimeStamp"]
                  }
                  onChange={this.handleChange.bind(this)}
                  max={this.state.searchFormObject["searchVal"]["endTimeStamp"]}
                />
              </div>
              <div className="input-box">
                <input
                  type="date"
                  name="endTimeStamp"
                  value={
                    this.state.searchFormObject["searchVal"]["endTimeStamp"]
                  }
                  onChange={this.handleChange.bind(this)}
                  max={getDate().endDate}
                />
              </div>
            </li>
          );
          break;

        case "operateType":
          return (
            <li>
              <div className="input-box" data-type="select">
                <select
                  name="searchVal"
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="">请选择操作类型</option>
                  {this.state.operateTypeList &&
                    this.state.operateTypeList.length >= 0 &&
                    this.state.operateTypeList.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.desc}
                        </option>
                      );
                    })}
                </select>
              </div>
            </li>
          );
          break;

        case "requestMethod":
          return (
            <li>
              <div className="input-box" data-type="select">
                <select
                  name="searchVal"
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="">请选择请求方法</option>
                  {this.state.requestMethodList &&
                    this.state.requestMethodList.length >= 0 &&
                    this.state.requestMethodList.map((item, i) => {
                      return (
                        <option key={i} value={item.value}>
                          {item.desc}
                        </option>
                      );
                    })}
                </select>
              </div>
            </li>
          );
          break;

        default:
          return (
            <li>
              <div className="input-box">
                <input
                  type="text"
                  name="searchVal"
                  value={this.state.searchFormObject["searchVal"]}
                  value={this.state.searchFormObject["searchVal"]}
                  onChange={this.handleChange.bind(this)}
                />
              </div>
            </li>
          );
      }
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className="tool">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <ul className="form-list">
            <li>
              <div className="input-box" data-type="select">
                <select
                  name="searchType"
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="">请选择搜寻条件</option>
                  <option value="userId">用戶ID</option>
                  <option value="userName">用戶帳號</option>
                  <option value="requestMethod">请求方法</option>
                  <option value="requestUrl">请求Url</option>
                  <option value="requestIp">请求IP</option>
                  <option value="description">描述</option>
                  <option value="timeRange">时间区间</option>
                  <option value="operateType">操作类型</option>
                </select>
              </div>
            </li>
            {this.selectRenderInputView()}
            <li>
              <button type="submit" className="search-submit">
                搜寻
              </button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
