import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { popupAction } from "../../../actions/popup";
import { admin_list } from "../../../actions/admin/list";
import { admin_pageColumn_search } from "../../../actions/admin/pageColumn";

@connect((state, props) => {
  return {
    limit: state.admin.limit,
    menuList: state.admin.menuList,
    levelList: state.admin.levelList,
    enabledList: state.admin.enabledList,
    fieldToBeOperateList: state.admin.fieldToBeOperateList,
    deductionRuleTypeList: state.admin.deductionRuleTypeList,
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions
  };
})
export default class PageColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      menuList: props.menuList,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      fieldToBeOperateList: props.fieldToBeOperateList,
      deductionRuleTypeList: props.deductionRuleTypeList,
      searchFormObject: {
        searchType: "",
        searchVal: ""
      },
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
    popupSetup["msg"] = nextProps.msg;
    popupSetup["match"] = nextProps.match;
    popupSetup["actions"] = nextProps.popupActions;

    this.setState({
      limit: nextProps.limit,
      menuList: nextProps.menuList,
      nowPageNumber: nextProps.match.params.nowPageNumber || 1,
      fieldToBeOperateList: nextProps.fieldToBeOperateList,
      deductionRuleTypeList: nextProps.deductionRuleTypeList,
      popupSetup: popupSetup
    });
  }

  handleChange(e) {
    let searchFormObject = this.state.searchFormObject;
    let name = e.target.name;
    let val = e.target.value;

    searchFormObject[name] = val;

    //this.props.history.push(`/${this.props.match.params.type}/${this.props.match.params.page}/1`);
    this.setState({
      searchFormObject: searchFormObject
    }, () => {
      // this.props.history.push({
      //   pathname:`/${this.props.match.params.type}/${this.props.match.params.page}/1`,
      //   state:{
      //     noRefresh:true,
      //   },
      // });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = this.state.searchFormObject;
    let match = this.state.match;
    let limit = this.state.limit;

    if (searchFormObject["searchType"] == "") {
      //如果想要搜尋的條件為空值
      this.props.dispatch(admin_list(match, limit));
    } else {
      //this.props.history.push(`/${this.props.match.params.type}/${this.props.match.params.page}/1`);
      this.props.dispatch(admin_pageColumn_search(match, limit, searchFormObject))
        .then(() => {
          this.props.history.push({
            pathname:`/${this.props.match.params.type}/${this.props.match.params.page}/1`,
            state:{
              noRefresh:true,
            },
          });
        });
    }
  }

  popup() {
    let popupSetup = this.state.popupSetup;
    popupSetup["status"] = "show";
    popupSetup["types"] = "form";
    popupSetup["title"] = "新增菜單列";
    popupSetup["match"] = this.props.match;
    popupSetup["actions"] = ["add", "pageColumns"];

    this.props.dispatch(popupAction(popupSetup));
  }

  render() {
    return (
      <div className="tool">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <ul className="form-list">
            <li>
              <div className="input-box" data-type="select">
                <select
                  name="searchType"
                  onChange={this.handleChange.bind(this)}
                >
                  <option value="">请选择收寻条件</option>
                  <option value="menuId">所属菜单</option>
                </select>
              </div>
            </li>
            <li>
              {this.state.searchFormObject["searchType"] == "menuId" && (
                <div className="input-box" data-type="select">
                  <select
                    name="searchVal"
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.menuList &&
                      this.state.menuList.length >= 0 &&
                      this.state.menuList.map((item, i) => {
                        return (
                          <option key={i} value={item.id}>
                            {item.menuName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}
            </li>
            <li>
              <button type="submit" className="search-submit">
                搜寻
              </button>
            </li>
          </ul>
        </form>

        <span className="btn add" onClick={this.popup.bind(this)}>
          新增菜单列
        </span>
      </div>
    );
  }
}
