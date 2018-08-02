import React, { Component } from "react";
import { connect } from "react-redux";

import { updateUserPassWord } from "../../actions/admin/update";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data
  };
})
export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      msg: props.popupMsg,
      formObject: {
        userId: props.seleEditData["id"],
        oldPwd   : "",
        firstPwd : "",
        newPwd   : ""
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
    let match      = this.state.match;

    if (formObject["firstPwd"] == formObject["newPwd"]) {
      if (formObject["newPwd"] != "") {
        if (
          formObject["newPwd"].length >= 6 &&
          formObject["newPwd"].length <= 16
        ) {
            //this.props.dispatch(update(match, formObject));
            this.props.dispatch( updateUserPassWord(formObject) );
        } else {
          this.setState({
            msg: "密碼長度不符"
          });
        }
      } else {
        this.setState({
          msg: "密碼不能為空白"
        });
      }
    } else {
      this.setState({
        msg: "密碼未一致性"
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">旧密码</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="oldPwd"
                    value={this.state.formObject["oldPwd"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="旧密码"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">第一道密码</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="firstPwd"
                    value={this.state.formObject["firstPwd"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="请输入8~16位密码"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">第二道密码</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="newPwd"
                    value={this.state.formObject["newPwd"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="请再次输入8~16密码"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">重设密码</button>
          </li>
        </ul>
      </form>
    );
  }
}
