import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
//Jsons
import lang from "../../json/multi_language";

//Components
import CheckBox from "../input/checkBox";
import { message, Select } from "antd";

//Actions
import { channelHistoryList } from "../../actions/channelHistory";
import { setup } from "../../actions/setup.js";

//Javascripts
import { getDate } from "../../public/javascripts/date";

const Option = Select.Option;
@connect((state, props) => {
  return {
    navData: state.nav.navData
  };
})
export default class ChannelHistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus: "hide",
      minDate: moment(getDate().endDate)
        .subtract(1, "years")
        .format("YYYY-MM-DD"),
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
        channelNames: [],
        startDate: getDate().endDate,
        endDate: getDate().endDate,
        limit: 10
      }
    };
  }

  handleSelectChange(val) {
    this.setState({
      searchFormObject: { ...this.state.searchFormObject, limit: Number(val) }
    });

    this.props.dispatch(
      channelHistoryList({ ...this.state.searchFormObject, limit: Number(val) })
    );
  }

  checkBoxBackArray(array) {
    let searchFormObject = Object.assign({}, this.state.searchFormObject);
    searchFormObject["channelIds"] = array
      .map((item, i) => {
        return item["checkBoxId"];
      })
      .toString();
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
    let startDate = moment(searchFormObject.startDate, "YYYY-MM-DD");
    let endDate = moment(searchFormObject.endDate, "YYYY-MM-DD");
    if (name == "startDate") {
      if (startDate > endDate) {
        searchFormObject.endDate = searchFormObject.startDate;
      }
    } else {
      if (startDate > endDate) {
        searchFormObject.startDate = searchFormObject.endDate;
      }
    }
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
    this.props.dispatch(channelHistoryList(searchFormObject));
  }

  componentWillMount() {
    let searchFormObject = this.state.searchFormObject;
    // let searchFormObject = {
    //   channelIds: "11,12",
    //   channelNames: "android-tanwan-1,android-tanwan-10",
    //   startDate: "2017-04-30",
    //   endDate: "2018-07-30"
    // };
    this.props.dispatch(channelHistoryList(searchFormObject));
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
              <div className="input-box" data-type="date">
                <input
                  type="date"
                  name="startDate"
                  value={this.state.searchFormObject["startDate"]}
                  onChange={this.handleChange.bind(this)}
                  // max={this.state.searchFormObject["endDate"]}
                  max={this.state.searchFormObject["endDate"]}
                  min={moment(this.state.searchFormObject["endDate"])
                    .subtract(1, "years")
                    .format("YYYY-MM-DD")}
                />
              </div>
              <div className="input-box" data-type="date">
                <input
                  type="date"
                  name="endDate"
                  value={this.state.searchFormObject["endDate"]}
                  onChange={this.handleChange.bind(this)}
                  max={this.state.searchFormObject["endDate"]}
                  min={moment(this.state.searchFormObject["endDate"])
                    .subtract(1, "years")
                    .format("YYYY-MM-DD")}
                  // min={this.state.searchFormObject["startDate"]}
                />
              </div>
            </li>

            <li>
              <button type="submit" className="search-submit">
                {lang["zh-cn"]["form"]["btn"]["search"]}
              </button>
            </li>

            <li>
              <span className="label" />
              <Select
                defaultValue="10"
                style={{ width: 110 }}
                onChange={e => this.handleSelectChange(e)}
              >
                <Option value="10">显示10笔</Option>
                <Option value="20">显示20笔</Option>
                <Option value="50">显示50笔</Option>
              </Select>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
