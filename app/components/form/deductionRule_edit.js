import React, { Component } from "react";
import { connect } from "react-redux";

//Components
import CheckBox from "../input/checkBox";

//Actions
import { setup } from "../../actions/setup";
import { update } from "../../actions/admin/update";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    deductionRuleTypeList: state.admin.deductionRuleTypeList,
    fieldToBeOperateList: state.admin.fieldToBeOperateList,
    channelList: state.charts.allChannelList,
    deFfieldToBeOperate: state.admin.info.fieldToBeOperate,
  };
})
export default class RuleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      fieldToBeOperateList: props.fieldToBeOperateList,
      deductionRuleTypeList: props.deductionRuleTypeList,
      channelList: props.channelList,
      msg: props.popupMsg,
      isAmount: !(props.deFfieldToBeOperate == 'newUserBindCount' || props.deFfieldToBeOperate == 'userBindCount'),
      formObject: {
        id: props.seleEditData["id"],
        name: props.seleEditData["name"],
        userId: props.seleEditData["userId"],
        guarantee: props.seleEditData["guarantee"],
        init: props.seleEditData["init"],
        step: props.seleEditData["step"],
        upperLimit: props.seleEditData["upperLimit"],
        priority: props.seleEditData["priority"],
        deductionRuleType: props.seleEditData["deductionRuleType"],
        remark: props.seleEditData["remark"],
        channelId: props.seleEditData["channelId"],
        fieldToBeOperate: props.deFfieldToBeOperate,
      },
      checkBoxSetup: {
        wantUseApi: "searchChannel", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["searchChannel"],
        multiple: false, //複選 true:開啟 false:關閉
        showSearchBox: true, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "channelNamea", //搜尋輸入框  inputName
        selectedData: props.seleEditData["channelId"].map((item, i) => {
          //初始值 { checkBoxId: [], checkBoxName:[] }
          return {
            checkBoxId: item.channelId,
            checkBoxName: item.channelName,
            channelIds: item.channelId,
            channelNames: item.channelName
          };
        })
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
        selectedData: props.seleEditData["userId"].map((item, i) => {
          //初始值 { checkBoxId: [], checkBoxName:[] }
          return {
            checkBoxId: item.userlIds,
            checkBoxName: item.userNames,
            userIds: item.userlIds,
            channelNames: item.userNames
          };
        })
      },
      userSearchFormObject: {
        userlIds: [],
        userNames: []
      }
    };
  }
    
  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      fieldToBeOperateList: nextProps.fieldToBeOperateList,
      deductionRuleTypeList: nextProps.deductionRuleTypeList,
      channelList: nextProps.channelList
    });
  }

  checkBoxBackArray(array) {
    let formObject = this.state.formObject;
    formObject["channelId"] = array[0]["checkBoxId"].toString();
    this.setState({
      formObject: formObject
    });
  }

  userCheckBoxBackArray(array) {
    let formObject = this.state.formObject;
    formObject["userId"] = array[0]["checkBoxId"].toString();
    this.setState({
      formObject: formObject
    });
  }

  handleChange(e) {
    let formObject = {...this.state.formObject};
    let name = e.target.name;
    let val = e.target.value;
    let isAmount = this.state.isAmount;
    
    formObject[name] = val;

    if(name == 'fieldToBeOperate'){
      isAmount = !(val == 'newUserBindCount' || val == 'userBindCount');
    }
    
    this.setState({
      formObject: formObject,
      isAmount
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let match = this.state.match;
    let formObject = Object.assign({}, this.state.formObject);

    if (formObject["channelId"] && typeof formObject["channelId"] == "object") {
      if (
        formObject["channelId"][0] &&
        formObject["channelId"][0]["channelId"]
      ) {
        if (typeof formObject["channelId"][0]["channelId"] == "object") {
          formObject["channelId"] = formObject["channelId"][0][
            "channelId"
          ].toString();
        } else {
          formObject["channelId"] = formObject["channelId"][0]["channelId"];
        }
      }
    }

    if (formObject["userId"] && typeof formObject["userId"] == "object") {
      if (formObject["userId"][0] && formObject["userId"][0]["userlIds"]) {
        if (typeof formObject["userId"][0]["userlIds"] == "object") {
          formObject["userId"] = formObject["userId"][0]["userlIds"].toString();
        } else {
          formObject["userId"] = formObject["userId"][0]["userlIds"];
        }
      }
    }

    if(this.state.isAmount){
      formObject["guarantee"] = Number(formObject["guarantee"]) * 100;
    }
    formObject["init"] = Number(formObject["init"]) / 100;
    formObject["step"] = Number(formObject["step"]) / 100;
    formObject["upperLimit"] = Number(formObject["upperLimit"]) / 100;
    this.props.dispatch(update(match, formObject));
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
                    required
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
                    value={this.state.formObject["fieldToBeOperate"]}
                    // value={this.props.deFfieldToBeOperate}
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.fieldToBeOperateList.map((item, i) => {
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
                    min="0"
                    required
                  />
                  {
                    this.state.isAmount ?
                      <span className="unit">元</span>:
                      <span className="unit">个</span>
                  }
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
                    min="0"
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
                    min="0"
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
                    min="0"
                    required
                  />
                  <span className="unit">％</span>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">优先权层级</li>
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
                    value={this.state.formObject["deductionRuleType"]}
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
              <li className="label">扣量规则备注</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="remark"
                    value={this.state.formObject["remark"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="扣量规则备注"
                  />
                </div>
              </li>
            </ul>
          </li>
          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">修改</button>
          </li>
        </ul>
      </form>
    );
  }
}
