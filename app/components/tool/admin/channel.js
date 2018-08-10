import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Jsons
import lang from "../../../json/multi_language";

//Actions
import { popupAction } from "../../../actions/popup";
import { admin_list } from "../../../actions/admin/list";

@connect((state, props) => {
  return {
    limit: state.admin.limit,
    menuList: state.admin.menuList,
    levelList: state.admin.levelList,
    enabledList: state.admin.enabledList,
    fieldToBeOperateList: state.admin.fieldToBeOperateList,
    deductionRuleTypeList: state.admin.deductionRuleTypeList,
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions
  };
})
export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      menuList: props.menuList,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      fieldToBeOperateList: props.fieldToBeOperateList,
      deductionRuleTypeList: props.deductionRuleTypeList,
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
    popupSetup["title"] = "新增渠道";
    popupSetup["match"] = this.props.match;
    popupSetup["actions"] = ["add", "channel"];

    this.props.dispatch(popupAction(popupSetup));
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
                  {/*<option value="userId">用户ID</option>
                  <option value="brandId">品牌ID</option>*/}
                  <option value="channelName">渠道名称</option>
                  <option value="channelId">渠道ID</option>
                </select>
              </div>
            </li>
            {this.state.searchFormObject["searchType"] != "" && (
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
            )}
            <li>
              <button type="submit" className="search-submit">
                搜寻
              </button>
            </li>
          </ul>
        </form>

        <span className="btn add" onClick={this.popup.bind(this)}>
          新增渠道
        </span>
      </div>
    );
  }
}
