import React, { Component } from "react";
import { connect } from "react-redux";

//Jsons
import lang from "../../json/multi_language";

//Components
import CheckBox from "../input/checkBox";
import { message } from "antd";

//Actions
import { chargeUserCountEveryHour } from "../../actions/charts";
import { setup } from "../../actions/setup.js";

//Javascripts
import { getDate } from "../../public/javascripts/date";

@connect((state, props) => {
  return {
    navData: state.nav.navData
  };
})
export default class OnlineUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxDate: getDate().endDate,
      checkBoxSetup: {
        wantUseApi: "searchUserChannel", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchUserChannel"],
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "channelName", //搜尋輸入框  inputName
        placeholder: lang["zh-cn"]["form"]["placeholder"]["channelName"],
        selectedData: [] //初始值 { checkBoxId: [], checkBoxName:[] }
      },
      searchFormObject: {
        channelId: "",
        searchDate: getDate().endDate
      }
    };
  }

  checkBoxBackArray(array) {
    let searchFormObject = Object.assign({}, this.state.searchFormObject);
    searchFormObject["channelId"] = array
      .map((item, i) => {
        return item["checkBoxId"];
      })
      .toString();

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
    let searchFormObject = this.state.searchFormObject;
    /*if(searchFormObject.channelId === ''){
      return message.warning('請选择渠道');
    } */
    this.props.dispatch(chargeUserCountEveryHour(searchFormObject));
  }

  render() {
    return (
      <div className="tool">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <ul className="form-list">
            <li>
              <span className="label">
                {lang["zh-cn"]["form"]["label"]["searchChannel"]}
              </span>
              <CheckBox
                match={this.props.match}
                checkBoxBackArray={this.checkBoxBackArray.bind(this)}
                searchFormObject={this.state.searchFormObject}
                checkBoxSetup={this.state.checkBoxSetup}
                useApiUrl={this.state.checkBoxSetup["useApiUrl"]}
              />
            </li>
            <li>
              <span className="label">
                {lang["zh-cn"]["form"]["label"]["searchTime"]}
              </span>
              <div className="input-box">
                <input
                  type="date"
                  name="searchDate"
                  value={this.state.searchFormObject["searchDate"]}
                  onChange={this.handleChange.bind(this)}
                  max={this.state.maxDate}
                />
              </div>
            </li>
            <li>
              <button type="submit" className="search-submit">
                {lang["zh-cn"]["form"]["btn"]["search"]}
              </button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
