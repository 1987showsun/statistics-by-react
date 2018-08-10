import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { setup } from "../../actions/setup";
import { getAllMenu } from "../../actions/getAllData";
import { update } from "../../actions/admin/update";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data
  };
})
export default class UserIpConfigEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      typeData: JSON.parse(sessionStorage.getItem("userIpTypeList")) || null,
      msg: props.popupMsg,
      formObject: {
        id: props.seleEditData["id"],
        userId: props.seleEditData["userId"],
        ip: props.seleEditData["ip"],
        type: props.seleEditData["type"]
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg
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
    let formObject = this.state.formObject;
    let match = this.state.match;
    this.props.dispatch(update(match, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">用戶ID</li>
              <li>{this.state.formObject["userId"]}</li>
            </ul>
          </li>

          <li>
            <ul>
              <li className="label">所屬主選單</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="type"
                    value={this.state.formObject["type"]}
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.typeData &&
                      this.state.typeData.map((item, i) => {
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
                    required
                  />
                </div>
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
