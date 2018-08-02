import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { admin_add } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    accountTypeList: state.admin.accountTypeList,
    limit: state.admin.limit
  };
})
export default class UserAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      accountTypeList: props.accountTypeList,
      msg: props.popupMsg,
      formObject: {
        username: "",
        password: "",
        accountType: 1
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      limit: nextProps.limit,
      accountTypeList: nextProps.accountTypeList
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
    this.props.dispatch(admin_add(match, limit, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">用户帐号</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="username"
                    value={this.state.formObject["username"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="用户帐号"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">用户密码</li>
              <li>
                <div className="input-box">
                  <input
                    type="password"
                    name="password"
                    value={this.state.formObject["password"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="用户密码"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">用户权限</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="accountType"
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.accountTypeList &&
                      this.state.accountTypeList.length >= 0 &&
                      this.state.accountTypeList.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.desc}
                          </option>
                        );
                      })}
                  </select>
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
