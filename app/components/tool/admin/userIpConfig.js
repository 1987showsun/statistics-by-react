import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Jsons
import lang from "../../../json/multi_language";

//Actions
import { popupAction } from "../../../actions/popup";
import { admin_list } from "../../../actions/admin/list";
import Axios from "axios";

@connect((state, props) => {
  return {
    limit: state.admin.limit,
    typeList: state.admin.userIpTypeList,
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions
  };
})
export default class UserIpConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      typeList: props.typeList,
      searchFormObject: {
        searchType: "",
        searchVal: ""
      },
      popupSetup: {
        status: props.popupStatus,
        types: props.popupTypes,
        data: props.popupData,
        title: props.popupTitle,
        msg: props.popupMsg,
        actions: props.popupActions
      }
    };
  }

  handleChange(e, main) {
    let searchFormObject = this.state.searchFormObject;
    let name = e.target.name;
    let val = e.target.value;

    searchFormObject[name] = val;
    if (main) searchFormObject.searchVal = "";

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  componentWillReceiveProps(nextProps) {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = nextProps.status;
    popupSetup["types"] = nextProps.types;
    popupSetup["data"] = nextProps.data;
    popupSetup["title"] = nextProps.title;
    popupSetup["msg"] = nextProps.msg;
    popupSetup["match"] = nextProps.match;
    popupSetup["actions"] = nextProps.popupActions;

    this.setState({
      limit: nextProps.limit,
      nowPageNumber: nextProps.match.params.nowPageNumber || 1,
      typeList: nextProps.typeList,
      popupSetup: popupSetup
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = {
      ...this.state.searchFormObject,
      searchVal: this.state.searchFormObject.searchVal
    };
    let match = this.state.match;
    let limit = this.state.limit;

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

  popup() {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = "show";
    popupSetup["types"] = "form";
    popupSetup["title"] = "新增用戶IP";
    popupSetup["match"] = this.props.match;
    popupSetup["actions"] = ["add", "userIpConfig"];

    this.props.dispatch(popupAction(popupSetup));
  }

  selectRenderInputView() {
    let searchType = this.state.searchFormObject["searchType"];
    if (searchType != "") {
      if (searchType != "type" && searchType != "accountType") {
        return (
          <li>
            <div className="input-box">
              <input
                type="text"
                name="searchVal"
                value={this.state.searchFormObject["searchVal"]}
                onChange={this.handleChange.bind(this)}
                placeholder={`${
                  lang["zh-cn"]["form"]["placeholder"][
                    this.state.searchFormObject["searchType"]
                  ]
                }`}
              />
            </div>
          </li>
        );
      } else {
        return (
          <li>
            <div className="input-box" data-type="select">
              <select name="searchVal" onChange={this.handleChange.bind(this)}>
                <option value="">请选择登录类型</option>
                {this.state[searchType + "List"] &&
                  this.state[searchType + "List"].map((item, i) => {
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
      }
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
                  onChange={e => this.handleChange(e, true)}
                >
                  <option value="">请选择搜寻条件</option>
                  <option value="userId">用戶ID</option>
                  <option value="type">登录类型</option>
                  <option value="ip">用戶IP</option>
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

        <span className="btn add" onClick={this.popup.bind(this)}>
          新增用户
        </span>
      </div>
    );
  }
}
