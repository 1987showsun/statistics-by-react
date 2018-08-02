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
export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      menuList: props.menuList,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      levelList: props.levelList,
      enabledList: props.enabledList,
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

  handleChange(e) {
    let name = e.target.name;
    let val = e.target.value;

    if (name === "searchType") {
      this.setState({
        searchFormObject: {
          ...this.state.searchFormObject,
          searchType: val
        }
      });
    } else if (name === "searchVal") {
      this.setState({
        searchFormObject: {
          ...this.state.searchFormObject,
          searchVal: val
        }
      });
    } else {
      this.setState({
        searchFormObject: {
          ...this.state.searchFormObject,
          searchType: "",
          searchVal: ""
        }
      });
    }
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
      fieldToBeOperateList: nextProps.fieldToBeOperateList,
      deductionRuleTypeList: nextProps.deductionRuleTypeList,
      levelList: nextProps.levelList,
      enabledList: nextProps.enabledList,
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

    this.props.history.push(
      `/${this.props.match.params.type}/${this.props.match.params.page}/1`
    );
    this.props.dispatch(admin_list(match, limit, searchFormObject));
  }

  popup() {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = "show";
    popupSetup["types"] = "form";
    popupSetup["title"] = "新增菜单";
    popupSetup["match"] = this.props.match;
    popupSetup["actions"] = ["add", "menu"];

    this.props.dispatch(popupAction(popupSetup));
  }

  selectRenderInputView() {
    let searchType = this.state.searchFormObject["searchType"];

    if (searchType != "") {
      if (
        searchType != "enabled" &&
        searchType != "accountType" &&
        searchType != "level"
      ) {
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
                {searchType === "enabled" && (
                  <option value="">请选择启用状态</option>
                )}
                {searchType === "level" && (
                  <option value="">请选择菜单层级</option>
                )}
                {this.state[searchType + "List"] &&
                  this.state[searchType + "List"].map((item, i) => {
                    return (
                      <option key={i} value={item.value} data-name={item.desc}>
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
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="">请选择搜寻条件</option>
                  <option value="menuName">菜单名称</option>
                  <option value="uri">路径匹配规则</option>
                  <option value="path">菜单路径</option>
                  <option value="pid">所属菜单</option>
                  <option value="enabled">启用状态</option>
                  <option value="level">菜单层级</option>
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
          新增菜单
        </span>
      </div>
    );
  }
}
