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
    accountTypeList: state.admin.accountTypeList,
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
export default class Role extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      menuList: props.menuList,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      fieldToBeOperateList: props.fieldToBeOperateList,
      deductionRuleTypeList: props.deductionRuleTypeList,
      searchFormObject: {
        searchName: "",
        condition: ""
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
    let searchFormObject = this.state.searchFormObject;
    let name = e.target.name;
    let val = e.target.value;

    searchFormObject[name] = val;

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
      popupSetup: popupSetup
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = this.state.searchFormObject;
    let match = this.state.match;
    let limit = this.state.limit;
    this.props.dispatch(admin_list(match, limit, searchFormObject));
  }

  popup() {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = "show";
    popupSetup["types"] = "form";
    popupSetup["title"] = "新增角色";
    popupSetup["match"] = this.props.match;
    popupSetup["actions"] = ["add", "role"];

    this.props.dispatch(popupAction(popupSetup));
  }

  render() {
    return (
      <div className="tool">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <ul className="form-list" />
        </form>
        <span className="btn add" onClick={this.popup.bind(this)}>
          新增角色
        </span>
      </div>
    );
  }
}
