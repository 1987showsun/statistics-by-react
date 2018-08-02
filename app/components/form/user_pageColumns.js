import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";
import { setup } from "../../actions/setup";
import axios from "axios";
import { Tree } from "antd";
import _ from "lodash";

import {
  admin_pageColumn_search,
  clean_admin_pageColumn_list
} from "../../actions/admin/pageColumn";
import { update_user_menuPageColumn } from "../../actions/admin/update";

const TreeNode = Tree.TreeNode;
@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    menuList: state.admin.userMenulist,
    menuPageColumnsList: state.admin.pageColumnList,
    loadingState : state.loading.state
  };
})
export default class UserPageColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus: "hide",
      match: props.match,
      msg: props.popupMsg,
      menuList: props.menuList,
      menuPageColumnsList: props.menuPageColumnsList || [],
      pageColumnsList: [],
      userPageColumnsList: [],

      formObject: {
        userId: props.seleEditData["id"],
        menuId: null,
        pageColumnIds: null
      }
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      allRoleList: nextProps.allRoleList,
      menuPageColumnsList: nextProps.menuPageColumnsList
    });
  }

  componentDidMount() {
    const axiosUrl = setup().api[9].menuList;
    const token = setup().token;
    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        },
        params: {
          enabled: 1,
          userId: this.props.seleEditData["id"]
        }
      })
      .then(res => {
        this.setState({
          userPageColumnsList: res.data.data.list
        });
      });
  }

  componentWillUnmount() {
    this.props.dispatch(clean_admin_pageColumn_list());
  }

  handleSelect = e => {
    let menuId = e.target.value;
    let pageColumnIds = null;
    let selectMenu = this.state.menuList.filter(item => {
      return menuId == item.id;
    });

    const pageColumnsList = this.state.userPageColumnsList
      .filter(item => menuId == item.id)[0]
      .pageColumns.map(el => el.id.toString());

    let searchFormObject = {
      searchType: "menuId",
      searchVal: menuId
    };
    let match = this.state.match;
    let limit = this.state.limit;

    this.props.dispatch(
      admin_pageColumn_search(match, limit, searchFormObject)
    );

    if (selectMenu[0].pageColumns) {
      pageColumnIds = selectMenu[0].pageColumns.map(item => item.id);
      this.setState({
        formObject: {
          ...this.state.formObject,
          menuId,
          pageColumnIds: pageColumnIds
        },
        pageColumnsList: selectMenu[0].pageColumns
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    let match = this.state.match;
    this.props.dispatch(
      update_user_menuPageColumn(match, this.state.formObject)
    );
  }

  onCheck = (checkedKeys, info) => {
    this.setState({
      formObject: {
        ...this.state.formObject,
        pageColumnIds: checkedKeys.toString()
      }
    });
  };

  render() {
    let checkedKeys = this.state.pageColumnsList.map(el => el.id.toString());
    let tree = this.state.menuPageColumnsList.map(el => (
      <TreeNode title={el.columnName} key={el.id} />
    ));
    const treeDisplay = !this.props.loadingState && tree.length > 0;
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li style={{ marginRight: "5px" }}>
                <div className="input-box" data-type="select">
                  <select
                    name="searchType"
                    onChange={e => this.handleSelect(e)}
                  >
                    <option value="">请选择菜单</option>
                    {this.state.menuList && this.state.menuList.length > 0
                      ? this.state.menuList.map((item, i) => {
                          return (
                            <option value={item.id} key={`menu${i}`}>
                              {item.menuName}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li style={{ maxHeight: "200px", overflow: "auto" }}>
                { this.props.loadingState &&
                  <div className="loadingBox">
                    <div className="lds-css ng-scope"><div className="lds-spinner" style={{"height":"100%"}}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                  </div>
                }
                {treeDisplay && (
                  <Tree
                    checkable
                    onCheck={this.onCheck}
                    defaultCheckedKeys={checkedKeys}
                  >
                    {tree}
                  </Tree>
                )}
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
