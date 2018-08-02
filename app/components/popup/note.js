import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Link, Switch } from "react-router-dom";

//Components

//Actions
import { popupAction } from "../../actions/popup";
import { admin_remove } from "../../actions/admin/remove";

@connect((state, props) => {
  return {
    status: state.popup.status,
    types: state.popup.types,
    data: state.popup.data,
    title: state.popup.title,
    msg: state.popup.msg,
    match: state.popup.match,
    random: state.popup.random,
    actions: state.popup.actions
  };
})
export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      popupSetup: {
        status: props.status,
        types: props.types,
        data: props.data,
        title: props.title,
        msg: props.msg,
        match: props.match,
        actions: props.actions
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = nextProps.status;
    popupSetup["types"] = nextProps.types;
    popupSetup["data"] = nextProps.data;
    popupSetup["title"] = nextProps.title;
    popupSetup["msg"] = nextProps.msg;
    popupSetup["match"] = nextProps.match;
    popupSetup["actions"] = nextProps.actions;

    this.setState({
      match: nextProps.match,
      popupSetup: popupSetup
    });
  }

  popup(status) {
    let popupSetup = this.state.popupSetup;
    let match = this.state.match;

    if (status == "no") {
      popupSetup["status"] = "hide";
      popupSetup["types"] = "";
      popupSetup["msg"] = "";
      popupSetup["title"] = "";
      popupSetup["data"] = [];
      popupSetup["match"] = [];
      popupSetup["actions"] = [];
      this.props.dispatch(popupAction(popupSetup));
    } else {
      switch (popupSetup["actions"][0]) {
        case "remove":
          this.props.dispatch(admin_remove(match, popupSetup));
          break;

        default:
      }
    }
  }

  selectRenderAction() {
    switch (this.state.popupSetup["actions"][0]) {
      case "remove":
        return (
          <div className="note-action">
            <span
              className="btn check-no"
              onClick={this.popup.bind(this, "no")}
            >
              取消
            </span>
            <span
              className="btn check-yes"
              onClick={this.popup.bind(this, "yes")}
            >
              確定
            </span>
          </div>
        );
        break;

      case "success":
        return (
          <div className="note-action">
            <span
              className="btn check-yes"
              onClick={this.popup.bind(this, "no")}
            >
              確定
            </span>
          </div>
        );
        break;
    }
  }

  render() {
    return (
      <div className="note">
        <section className="msg">{this.state.popupSetup["msg"]}</section>
        {this.selectRenderAction()}
      </div>
    );
  }
}
