import React, { Component } from "react";
import { connect } from "react-redux";

//Components
import CheckBox from "../input/checkBox";

//Actions
import { setup } from "../../actions/setup";
import { update_user_role } from "../../actions/admin/update";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    allRoleList: state.admin.roleList
  };
})
export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus: "hide",
      match: props.match,
      msg: props.popupMsg,
      allRoleList: props.allRoleList,
      checkBoxSetup: {
        wantUseApi: "allRole", //想使用的 Api
        useApiUrl: setup().api["makeUp"]["allRole"],
        multiple: true, //複選 true:開啟 false:關閉
        showSearchBox: false, //搜尋輸入框 true:顯示 false:隱藏
        inputName: "", //搜尋輸入框  inputName
        selectedData: props.seleEditData["roles"].map((item, i) => {
          //初始值 { checkBoxId: [], checkBoxName:[] }
          return {
            checkBoxId: item.id,
            checkBoxName: item.roleName
          };
        })
      },
      formObject: {
        userId: props.seleEditData["id"],
        roleIds: props.seleEditData["roles"]
          .map((item, i) => {
            return item.id;
          })
          .toString()
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      allRoleList: nextProps.allRoleList
    });
  }

  checkBoxBackArray(array) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["roleIds"] = array
      .map((item, i) => {
        return item.checkBoxId;
      })
      .toString();

    this.setState({
      formObject: formObject
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
    let formObject = Object.assign({}, this.state.formObject);
    let match = this.state.match;
    this.props.dispatch(update_user_role(match, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">请选取角色</li>
              <li>
                <CheckBox
                  checkBoxSetup={this.state.checkBoxSetup}
                  searchFormObject={this.state.formObject}
                  checkBoxBackArray={this.checkBoxBackArray.bind(this)}
                  useApiUrl={this.state.checkBoxSetup["useApiUrl"]}
                />
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
