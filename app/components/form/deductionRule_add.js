import React, { Component } from "react";
import { connect } from "react-redux";
import { DatePicker } from "antd";
import moment from "moment";

//Components
import CheckBox from "../input/checkBox";

//Actions
import { setup } from "../../actions/setup";
import { allChannelList } from "../../actions/charts";
import { admin_add } from "../../actions/admin/list";

//javascripts
import { changeMs, changeDateNoTime } from "../../public/javascripts/date";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD HH:mm:ss";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    limit: state.admin.limit,
    levelList: state.admin.levelList,
    enabledList: state.admin.enabledList,
    deductionRuleTypeList: state.admin.deductionRuleTypeList,
    fieldToBeOperateList: state.admin.fieldToBeOperateList,
    channelList: state.charts.allChannelList
  };
})
export default class RuleAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      limit: props.limit,
      levelList: props.levelList,
      enabledList: props.enabledList,
      fieldToBeOperateList: props.fieldToBeOperateList,
      deductionRuleTypeList: props.deductionRuleTypeList,
      channelList: props.channelList,
      msg: props.popupMsg,
      endOpen: false,
      isAmount: true,
      formObject: {
        userId: "",
        guarantee: "1",
        init: "1",
        step: "1",
        upperLimit: "1",
        priority: "1",
        deductionRuleType: "", //下拉式
        fieldToBeOperate: "", //下拉式
        channelId: "", //下拉式
        name: "", //非必填 沒填後端自動給值
        //remark                : "", //非必填 沒填後端自動給值
        beginTimestamp: "", //Date 開始時間戳
        endTimestamp: "" //Date 結束時間戳
      },
      checkBoxSetup: {
        wantUseApi: "searchChannel", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchChannel"],
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "channelName", //搜尋輸入框  inputName
        selectedData: [] //初始值 { checkBoxId: [], checkBoxName:[] }
      },
      searchFormObject: {
        channelIds: [],
        channelNames: []
      },
      userCheckBoxSetup: {
        wantUseApi: "searchUser", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchUser"],
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "userName", //搜尋輸入框  inputName
        selectedData: [] //初始值 { checkBoxId: [], checkBoxName:[] }
      },
      userSearchFormObject: {
        userlIds: [],
        userNames: []
      }
    };
  }

  componentDidMount() {
    this.props.dispatch(allChannelList());
  }

  componentWillReceiveProps(nextProps) {
    let formObject = this.state.formObject;
    formObject["deductionRuleType"] = nextProps.deductionRuleTypeList[0].value;
    formObject["fieldToBeOperate"] = nextProps.fieldToBeOperateList[0].value;

    this.setState({
      msg: nextProps.popupMsg,
      deductionRuleTypeList: nextProps.deductionRuleTypeList,
      fieldToBeOperateList: nextProps.fieldToBeOperateList,
      channelList: nextProps.channelList,
      formObject: formObject
    });
  }

  checkBoxBackArray(array) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["channelId"] = array.map((item, i) => {
      return item.checkBoxId;
    });

    this.setState({
      formObject: formObject
    });
  }

  userCheckBoxBackArray(array) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["userId"] = array.map((item, i) => {
      return item.checkBoxId;
    });

    this.setState({
      formObject: formObject
    });
  }

  handleChange(e) {
    let formObject = this.state.formObject;
    let type = e.target.type;
    let name = e.target.name;
    let val = e.target.value;
    let isAmount = this.state.isAmount;

    formObject[name] = val;

    if (name == "fieldToBeOperate") {
      isAmount = !(val == "newUserBindCount" || val == "userBindCount");
    }

    this.setState({
      formObject: formObject,
      isAmount
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let limit = this.state.limit;
    let match = this.state.match;
    let formObject = Object.assign({}, this.state.formObject);
    formObject["init"] = Number(this.state.formObject["init"]) / 100;
    formObject["step"] = Number(this.state.formObject["step"]) / 100;
    formObject["upperLimit"] =
      Number(this.state.formObject["upperLimit"]) / 100;
    if (this.state.isAmount) {
      formObject["guarantee"] =
        Number(this.state.formObject["guarantee"]) * 100;
    }
    formObject["channelId"] = formObject["channelId"].toString();
    formObject["userId"] = formObject["userId"].toString();
    this.props.dispatch(admin_add(match, limit, formObject));
  }

  dateTimeOnChangeStart(value, dateString) {
    let formObject = this.state.formObject;
    formObject["beginTimestamp"] = changeMs(dateString);
    this.setState({
      formObject
    });
  }

  dateTimeOnChangeEnd(value, dateString) {
    let formObject = this.state.formObject;
    formObject["endTimestamp"] = changeMs(dateString);
    this.setState({
      formObject
    });
  }

  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">扣量规则名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="name"
                    value={this.state.formObject["name"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="名稱"
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">用户帐号</li>
              <li>
                <CheckBox
                  searchFormObject={this.state.userSearchFormObject}
                  checkBoxBackArray={this.userCheckBoxBackArray.bind(this)}
                  checkBoxSetup={this.state.userCheckBoxSetup}
                  useApiUrl={this.state.userCheckBoxSetup["useApiUrl"]}
                />
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">需要操作的字段</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="fieldToBeOperate"
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.fieldToBeOperateList &&
                      this.state.fieldToBeOperateList.length >= 0 &&
                      this.state.fieldToBeOperateList.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.desc}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">保底</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="guarantee"
                    value={this.state.formObject["guarantee"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="保底"
                    min="1"
                    required
                  />
                  {this.state.isAmount ? (
                    <span className="unit">元</span>
                  ) : (
                    <span className="unit">个</span>
                  )}
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">初始扣量</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="init"
                    value={this.state.formObject["init"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="初始扣量"
                    max="100"
                    min="1"
                    required
                  />
                  <span className="unit">％</span>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">每天扣量步增</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="step"
                    value={this.state.formObject["step"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="每天扣量步增"
                    max="100"
                    min="1"
                    required
                  />
                  <span className="unit">％</span>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">上限扣量</li>
              <li>
                <div className="input-box">
                  <input
                    type=""
                    name="upperLimit"
                    value={this.state.formObject["upperLimit"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="上限扣量"
                    max="100"
                    min="1"
                    required
                  />
                  <span className="unit">％</span>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">优先</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="priority"
                    value={this.state.formObject["priority"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="优先权层级"
                    min="1"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">扣除规则类型</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="deductionRuleType"
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.deductionRuleTypeList &&
                      this.state.deductionRuleTypeList.length >= 0 &&
                      this.state.deductionRuleTypeList.map((item, i) => {
                        return (
                          <option key={i} value={item.value}>
                            {item.desc}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">渠道名称</li>
              <li>
                <CheckBox
                  searchFormObject={this.state.searchFormObject}
                  checkBoxBackArray={this.checkBoxBackArray.bind(this)}
                  checkBoxSetup={this.state.checkBoxSetup}
                  useApiUrl={this.state.checkBoxSetup["useApiUrl"]}
                />
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">规则生效的时间戳</li>
              <li>
                <div className="input-box">
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="规则生效的时间戳"
                    defaultValue={moment()}
                    onChange={this.dateTimeOnChangeStart.bind(this)}
                    onOpenChange={this.handleStartOpenChange.bind(this)}
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">规则失效的时间戳</li>
              <li>
                <div className="input-box">
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="规则失效的时间戳"
                    defaultValue={moment()}
                    onChange={this.dateTimeOnChangeEnd.bind(this)}
                    open={this.state.endOpen}
                    onOpenChange={this.handleEndOpenChange.bind(this)}
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
