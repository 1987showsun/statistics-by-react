import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";

//Components
import CheckBox from "../input/checkBox";

//Actions

import { update_channel_user } from "../../actions/admin/update";
import { setup } from "../../actions/setup";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    allRoleList: state.admin.roleList
  };
})
export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus: "hide",
      match: props.match,
      msg: props.popupMsg,
      allRoleList: props.allRoleList,
      checkBoxSetup: {
        wantUseApi: "searchUser", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchUser"],
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "userName", //搜尋輸入框  inputName
        selectedData: []
      },
      formObject: {
        channelId: props.seleEditData["id"],
        userId: []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      allRoleList: nextProps.allRoleList
    });
  }

  checkBoxBackArray(array) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["userId"] = array
      .map((item, i) => {
        return item["checkBoxId"];
      })
      .toString();
    formObject["userNames"] = array.map((item, i) => {
      return item.checkBoxName;
    });

    this.setState({
      formObject: formObject
    });
  }

  handleChange(e) {
    let formObject = this.state.formObject;
    let name = e.target.name;
    let val = e.target.value;
    formObject[name] = val;
    this.setState({
      formObject: formObject
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let formObject = Object.assign({}, this.state.formObject);
    let match = this.state.match;
    this.props.dispatch(update_channel_user(match, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">请选取用戶</li>
              <li>
                <CheckBox
                  checkBoxSetup={this.state.checkBoxSetup}
                  searchFormObject={this.state.formObject}
                  checkBoxBackArray={this.checkBoxBackArray.bind(this)}
                  useApiUrl={this.state.checkBoxSetup["useApiUrl"]}
                />
              </li>
            </ul>
          </li>
          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">修改</button>
          </li>
        </ul>
      </form>
    );
  }
}
