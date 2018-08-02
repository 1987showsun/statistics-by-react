import React, { Component } from "react";
import { connect } from "react-redux";

//multi-language
//import multiLanguage                                               from '../../json/multi_language';

//Actions
import { signIn } from "../../actions/login";

@connect((state, props) => {
  return {
    loginStatusCode: state.login.code,
    loginStatusMsg: state.login.msg
  };
})
export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.loginStatusCode,
      msg: props.loginStatusMsg,
      formObject: {
        username: "",
        password: ""
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      code: nextProps.loginStatusCode,
      msg: nextProps.loginStatusMsg
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.code != this.state.code) {
      switch (this.state.code) {
        case 0:
          this.props.history.push("/");
          break;

        case -1:
          break;
      }
    }
  }

  handleChange(e) {
    let name = e.target.name;
    let val = e.target.value;
    let formObject = this.state.formObject;

    formObject[name] = val;

    this.setState({
      formObject: formObject
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let formObject = this.state.formObject;
    this.props.dispatch(signIn(formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="login">
        <div className="logo">
          <h1>Statistical System</h1>
        </div>
        <ul>
          <li>
            <div className="input-box">
              <input
                type="text"
                name="username"
                value={this.state.formObject["username"]}
                onChange={this.handleChange.bind(this)}
                data-text-align="center"
              />
            </div>
          </li>
          <li>
            <div className="input-box">
              <input
                type="password"
                name="password"
                value={this.state.formObject["password"]}
                onChange={this.handleChange.bind(this)}
                data-text-align="center"
              />
            </div>
          </li>
          <li className="msg">{this.state.msg != "" && this.state.msg}</li>
          <li>
            <div className="btn submit">
              <button type="submit" data-width="full-width">
                登入
              </button>
            </div>
          </li>
        </ul>
      </form>
    );
  }
}
