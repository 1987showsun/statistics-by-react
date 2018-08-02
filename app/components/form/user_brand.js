import React, { Component } from "react";
import { connect } from "react-redux";

//Components
import CheckBox              from "../input/checkBox";

//Actions
import { setup }             from "../../actions/setup";
import { update_user_brand } from "../../actions/admin/update";
import { getAllBrand }       from "../../actions/getAllData";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data
  };
})
export default class UserToBrand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      update_status: 0,
      msg: props.popupMsg,
      checkBoxSetup: {
        wantUseApi            : "allBrand", //想使用的 Api
        useApiUrl             : setup().api['makeUp']['allBrand'],
        multiple              : true,       //複選 true:開啟 false:關閉
        showSearchBox         : false,      //搜尋輸入框 true:顯示 false:隱藏
        inputName             : "",         //搜尋輸入框  inputName
        selectedData   : props.seleEditData["brands"].map((item, i) => {
          //初始值 { checkBoxId: [], checkBoxName:[] }
          return {
            checkBoxId   : item.id,
            checkBoxName : item.brandName
          };
        })
      },

      formObject: {
        userId     : props.seleEditData["id"],
        brandIds   : [],
        brandNames : []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg
    });
  }

  checkBoxBackArray(array) {
    let searchFormObject = Object.assign({}, this.state.searchFormObject);
    searchFormObject["brandIds"] = array.map((item, i) => {
      return item.brandIds;
    });
    searchFormObject["brandNames"] = array.map((item, i) => {
      return item.brandNames;
    });

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  handleChange(e) {
    let update_status = this.state.update_status;
    let formObject = this.state.formObject;
    let name = e.target.name;
    let val = e.target.value;

    if (name == "update_status") {
      update_status = val;
    } else {
      formObject[name] = val;
    }

    this.setState({
      update_status: update_status,
      formObject: formObject
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let selectedData = this.state.checkBoxSetup["selectedData"];
    let formObject = this.state.formObject;
    let match = this.state.match;
    formObject["brandIds"] = selectedData.map(item => {
      return item.checkBoxId;
    });
    formObject["brandNames"] = selectedData.map(item => {
      return item.checkBoxName;
    });
    this.props.dispatch(update_user_brand(match, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">请选择品牌</li>
              <li>
                <CheckBox
                  checkBoxSetup     = {this.state.checkBoxSetup}
                  searchFormObject  = {this.state.formObject}
                  checkBoxBackArray = {this.checkBoxBackArray.bind(this)}
                  useApiUrl         = {this.state.checkBoxSetup['useApiUrl']}
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
