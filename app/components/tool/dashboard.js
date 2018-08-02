import React, { Component } from "react";
import { connect } from "react-redux";

//Jsons
import lang from "../../json/multi_language";

//Components
import CheckBox from "../input/checkBox";
import { message } from "antd";

//Actions
import { home } from "../../actions/home";
import { setup } from "../../actions/setup.js";

//Javascripts
import { getDate } from "../../public/javascripts/date";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    allChannelList: state.charts.allChannelList
  };
})
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      allChannelList: props.allChannelList,
      minDate: getDate().startDate,
      maxDate: getDate().endDate,
      checkBoxSetup: {
        wantUseApi: "searchUserChannel", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchUserChannel"],
        multiple: true, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "channelName", //搜尋輸入框  inputName
        placeholder: lang["zh-cn"]["form"]["placeholder"]["channelName"],
        selectedData: [] //初始值 { checkBoxId: [], checkBoxName:[] }
      },
      searchFormObject: {
        channelIds: [],
        channelNames: []
      }
    };
  }
  componentDidMount() {
    this.props.dispatch(home());
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      allChannelList: nextProps.allChannelList
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

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = this.state.searchFormObject;
    // if(!searchFormObject.channelIds.length){
    //   return message.warning('請选择渠道');
    // }
    this.props.checkSearchFormObject(searchFormObject);
    this.props.dispatch(home(searchFormObject));
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
                searchFormObject={this.state.searchFormObject}
                checkBoxBackArray={this.checkBoxBackArray.bind(this)}
                checkBoxSetup={this.state.checkBoxSetup}
                useApiUrl={this.state.checkBoxSetup["useApiUrl"]}
              />
            </li>
            <li>
              <button
                type="submit"
                className="search-submit"
                style={{ margin: "0px 10px" }}
              >
                {lang["zh-cn"]["form"]["btn"]["search"]}
              </button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
