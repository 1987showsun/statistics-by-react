import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { message } from "antd";

//Actions
import { logout } from "../../actions/login";
import { header } from "../../actions/common";
import { popupAction } from "../../actions/popup";

let reloadDelay;

@connect((state, props) => {
  return {
    loginStatus: state.login.loginStatus,
    navStatus: state.common.navStatus,
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions
  };
})
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: JSON.parse(sessionStorage.getItem("user")),
      loginStatus: props.loginStatus,
      navStatus: props.navStatus,
      match: props.match || {},
      logout: props.logout,
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

  componentWillReceiveProps(nextProps) {
    let loginStatus = nextProps.loginStatus;
    this.setState(
      {
        loginStatus: loginStatus,
        logout: nextProps.logout,
        match: nextProps.match || {},
        navStatus: nextProps.navStatus
      },
      () => {
        if (loginStatus) {
          message.success("即將登出");
          clearTimeout(reloadDelay);
          reloadDelay = setTimeout(() => {
            location.href = "/";
          }, 1000);
        }
      }
    );
  }

  navSwitch() {
    let navStatus = this.state.navStatus;
    if (navStatus == "show") {
      navStatus = "hide";
    } else {
      navStatus = "show";
    }
    this.props.navSwitch(navStatus);
    this.props.dispatch(header(navStatus));
  }

  handleClick = () => {
    this.props.dispatch(logout());
  };

  updatePassWord() {
    let popupSetup = this.state.popupSetup;
    let userInfo = this.state.userInfo;

    popupSetup["status"] = "show";
    popupSetup["types"] = "form";
    popupSetup["data"] = userInfo;
    popupSetup["match"] = this.state.match;
    popupSetup["actions"] = ["edit", "userPassword"];

    this.props.dispatch(popupAction(popupSetup));
  }

  render() {
    return (
      <header>
        <div className={`header ${this.state.navStatus}`}>
          <button className="nav" onClick={this.navSwitch.bind(this)} />
          <div className="right">
            <span class="cover fas fa-user" />
            <div className="setting-box">
              <li className="username">
                您好！欢迎 <span>{this.state.userInfo["userName"]}</span> 用戶
              </li>
              <ul>
                <li>
                  <NavLink
                    onClick={() => this.handleClick()}
                    to={"/"}
                    className="btn"
                  >
                    帐号登出
                  </NavLink>
                </li>
                <li>
                  <span
                    className="btn"
                    onClick={this.updatePassWord.bind(this)}
                  >
                    重置密码
                  </span>
                </li>
                <li>
                  <NavLink
                    to={"/verification"}
                    className="btn"
                  >
                    设置两步验证
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
