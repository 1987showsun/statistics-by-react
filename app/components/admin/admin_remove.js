import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";

//Jsons
import infoLabel from "../../json/infoLabel.json";
import lang from "../../json/multi_language.json";

//Component

//Actions
import { popupAction } from "../../actions/popup";

@connect((state, props) => {
  return {
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions
  };
})
export default class RemoveIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      match: props.match,
      actionType: props.actionType,
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
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = nextProps.status;
    popupSetup["types"] = nextProps.types;
    popupSetup["data"] = nextProps.data;
    popupSetup["title"] = nextProps.title;
    popupSetup["msg"] = nextProps.popupMsg;
    popupSetup["match"] = nextProps.match;
    popupSetup["actions"] = nextProps.popupActions;

    this.setState({
      popupSetup: popupSetup
    });
  }

  remove() {
    let match = this.state.match;
    let popupSetup = this.state.popupSetup;
    let actionType = this.state.actionType;

    switch (actionType) {
      case "users":
        popupSetup["title"] = `刪除${this.state.item["userName"]}用戶`;
        break;

      case "brands":
        popupSetup["title"] = `刪除${this.state.item["brandName"]}品牌`;
        break;
    }

    popupSetup["status"] = "show";
    popupSetup["types"] = `note`;
    popupSetup["data"] = this.state.item;
    popupSetup["match"] = this.state.match;
    popupSetup["actions"] = ["remove", "makeUp"];
    this.props.dispatch(popupAction(popupSetup));
  }

  render() {
    let item = this.state.item;
    let page = this.state.match["params"]["page"];
    if (page == "14") {
      return (
        <span
          className="btn icon far fa-trash-alt"
          onClick={this.remove.bind(this)}
        />
      );
    } else {
      return null;
    }
  }
}
