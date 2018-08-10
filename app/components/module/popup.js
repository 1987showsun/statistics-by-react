import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Components
import Form from "../form";
import Note from "../popup/note";
import Qr   from "../popup/qr";

//Actions
import { popupAction } from "../../actions/popup";
import ReactJson from "react-json-view";

@connect((state, props) => {
  return {
    status: state.popup.status,
    types: state.popup.types,
    data: state.popup.data,
    title: state.popup.title,
    msg: state.popup.msg,
    match: state.popup.match,
    random: state.popup.random,
    actions: state.popup.actions,
    json: state.popup.json
  };
})
export default class Popup extends React.Component {
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

  componentDidMount() {}

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
      popupSetup: popupSetup
    });
  }

  popup() {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = "hide";
    popupSetup["types"] = "";
    popupSetup["data"] = [];
    popupSetup["title"] = "";
    popupSetup["msg"] = "";
    popupSetup["match"] = [];
    popupSetup["actions"] = ["", ""];
    this.props.dispatch(popupAction(popupSetup));
  }

  selectRenderView() {
    let popupSetup = this.state.popupSetup;

    switch (popupSetup["types"]) {
      case "json":
        return (
          <ReactJson
            src={popupSetup.data}
            theme="monokai"
            style={{ width: "100%", minHeight: "200px", borderRadius: "4px" }}
          />
        );
        return;
      case "form":
        return <Form match={popupSetup.match} />;
        break;

      case "note":
        return <Note match={popupSetup.match} />;
        break;

      case "qr":
        return <Qr match={popupSetup.match} />;
        break;

      default:
    }
  }

  render() {
    return (
      <div id="popup" className={`${this.state.popupSetup["status"]}`}>
        <div className="null" onClick={this.popup.bind(this)} />
        <div className="popup-block">
          <section className="popup-block-title">
            <h3>{this.state.popupSetup.title}</h3>
          </section>
          <section className="popup-block-content">
            {this.selectRenderView()}
          </section>
        </div>
      </div>
    );
  }
}
