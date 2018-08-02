import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

import { admin_add } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    popupMsg     : state.popup.msg,
    limit: state.admin.limit
  };
})
export default class MemberAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit       : props.limit,
      match       : props.match,
      msg         : props.popupMsg,
      formObject  : {
        roleName    : "",
        roleEnName  : ""
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg            : nextProps.popupMsg
    })
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
              <li className="label">角色中文名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="roleName"
                    value={this.state.formObject["roleName"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="角色中文名稱"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">角色英文名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="roleEnName"
                    value={this.state.formObject["roleEnName"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="角色英文名稱"
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
