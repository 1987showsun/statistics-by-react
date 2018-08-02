import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Components
import CheckBox from "../input/checkBox";

import { home } from "../../actions/home";

//Actions
import {
  update_user_role,
  update_user_channel
} from "../../actions/admin/update";

//Javascripts
import { getDate } from "../../public/javascripts/date";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    allRoleList: state.admin.roleList,
    allChannelList: state.charts.allChannelList
  };
})
export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus: "hide",
      match: props.match,
      msg: props.popupMsg,
      minDate: getDate().startDate,
      maxDate: getDate().endDate,
      allChannelList: props.allChannelList,
      checkBoxSetup: {
        wantUseApi: "searchChannel", //想使用的 Api
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "channelName", //搜尋輸入框  inputName
        selectedData: [] //初始值 { checkBoxId: [], checkBoxName:[] }
      },
      searchFormObject: {
        channelIds: [],
        channelNames: []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      allChannelList: nextProps.allChannelList
    });
  }

  checkBoxBackArray(array) {
    let searchFormObject = Object.assign({}, this.state.searchFormObject);
    searchFormObject["channelIds"] = array.map((item, i) => {
      return item.checkBoxId;
    });
    searchFormObject["channelNames"] = array.map((item, i) => {
      return item.checkBoxName;
    });

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  handleChange(e) {
    let searchFormObject = this.state.searchFormObject;
    let name = e.target.name;
    let val = e.target.value;

    searchFormObject[name] = val;

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let formObject = {};
    let match = this.state.match;
    if (
      this.state.searchFormObject &&
      match &&
      match.params &&
      match.params.id
    ) {
      formObject = {
        channelId: this.state.searchFormObject.channelIds,
        userId: match.params.id
      };
    }
    this.props.dispatch(update_user_channel(match, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">请选取渠道</li>
              <li>
                <CheckBox
                  match={this.props.match}
                  checkBoxSetup={this.state.checkBoxSetup}
                  searchFormObject={this.state.searchFormObject}
                  checkBoxBackArray={this.checkBoxBackArray.bind(this)}
                />
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
