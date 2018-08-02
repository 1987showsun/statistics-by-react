import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { admin_add } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    limit: state.admin.limit,
    levelList: state.admin.levelList,
    enabledList: state.admin.enabledList
  };
})
export default class ChannelAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      limit: props.limit,
      levelList: props.levelList,
      enabledList: props.enabledList,
      msg: props.popupMsg,
      formObject: {
        channelName: ""
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
              <li className="label">渠道名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="channelName"
                    value={this.state.formObject["channelName"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="渠道名称"
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
