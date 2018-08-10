import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { getAllMenu } from "../../actions/getAllData";
import { admin_add, admin_list } from "../../actions/admin/list";

import CheckBox from "../input/checkBox";
import { setup } from "../../actions/setup";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    typeData: state.admin.userIpTypeList,
    limit: state.admin.limit
  };
})
export default class UserIpConfigAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      limit: props.limit,
      typeData: props.typeData,
      msg: props.popupMsg,
      formObject: {
        ip: "",
        userId: null,
        type: 1
      },
      userCheckBoxSetup: {
        wantUseApi: "searchUser", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchUser"],
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "userName", //搜尋輸入框  inputName
        selectedData: [] //初始值 { checkBoxId: [], checkBoxName:[] }
      },
      userSearchFormObject: {
        userlIds: [],
        userNames: []
      }
    };
  }

  componentDidMount() {
    let nowPageNumber = this.state.nowPageNumber;
    let match = this.state.match;
    let limit = this.state.limit;

    this.props.dispatch(admin_list(match, limit));

    //this.props.dispatch(getAllMenu());
  }

  componentWillReceiveProps(nextProps) {
    let formObject = this.state.formObject;
    if (!nextProps.popupMsg) {
      formObject["type"] = nextProps.typeData[0]["value"];
    }
    this.setState({
      msg: nextProps.popupMsg,
      typeData: nextProps.typeData,
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
    let limit = this.state.limit;
    let match = this.state.match;
    let formObject = this.state.formObject;
    formObject["userId"] = formObject["userId"].toString();
    this.props.dispatch(admin_add(match, limit, formObject));
  }

  userCheckBoxBackArray(array) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["userId"] = array.map((item, i) => {
      return item.checkBoxId;
    });
    this.setState({
      formObject: formObject
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">用户帐号</li>
              <li>
                <CheckBox
                  searchFormObject={this.state.userSearchFormObject}
                  checkBoxBackArray={this.userCheckBoxBackArray.bind(this)}
                  checkBoxSetup={this.state.userCheckBoxSetup}
                  useApiUrl={this.state.userCheckBoxSetup["useApiUrl"]}
                />
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">登录类型</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="type"
                    value={this.state.formObject["type"]}
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.typeData.map((item, i) => {
                      return (
                        <option key={i} value={item["value"]}>
                          {item["desc"]}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>
            </ul>
          </li>

          <li>
            <ul>
              <li className="label">用戶IP</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="ip"
                    value={this.state.formObject["ip"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="用戶IP"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>

          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">新增</button>
          </li>
        </ul>
      </form>
    );
  }
}
