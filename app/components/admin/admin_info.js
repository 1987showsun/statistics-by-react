import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import { Modal, Button } from "antd";

import {
  message,
  Card,
  Table,
  Icon,
  Switch,
  Radio,
  Form,
  Divider,
  Tree
} from "antd";

import axios from "axios";
import { setup } from "../../actions/setup";
import _ from "lodash";
import { changeDate } from "../../public/javascripts/date";
import Searchbar from "../input/searchbar";

//Jsons
import infoLabel from "../../json/infoLabel.json";
import lang from "../../json/multi_language.json";

//Components
import Sitmap from "../common/sitmap";
import Remove from "./admin_remove";

//Actions
import { popupAction } from "../../actions/popup";
import { admin_info, admin_enabled } from "../../actions/admin/info";
import { getAllMenu } from "../../actions/getAllData";

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@connect((state, props) => {
  return {
    menuAllData: state.search.data,
    navData: state.nav.navData,
    info: state.admin.info,
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions,
    accountTypeList: state.admin.accountTypeList
  };
})
export default class AdminInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: "",
      rowSelectionState: undefined,
      selectedRowKeys: [],

      userChannelData: [],
      channelPagination: {},
      channelLoading: false,
      channelCard: null,

      channelUserData: [],
      userPagination: {},
      userLoading: false,
      userCard: null,

      channelBrandData: [],
      brandPagination: {},
      brandLoading: false,
      brandCard: null,

      roleUserData: [],
      rolePagination: {},
      roleLoading: false,
      roleCard: null,
      roleSearch: null,

      hideRemoveId: {
        "9": [],
        "10": [1, 2],
        "11": [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        "12": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31,
          32,
          33,
          34,
          35,
          36
        ],
        "13": [1, 2],
        "14": [],
        "15": [1, 10, 11, 13, 14, 15]
      },
      match: props.match,
      menuAllData: props.menuAllData,
      navData: props.navData,
      info: props.info,
      infoLabel: infoLabel[props.match.params.page],
      accountTypeList:
        JSON.parse(localStorage.getItem("accountTypeList")) || null,
      popupSetup: {
        status: props.popupStatus,
        types: props.popupTypes,
        data: props.popupData,
        title: props.popupTitle,
        msg: props.popupMsg,
        actions: props.popupActions
      },
      andmore: undefined
    };
  }

  componentDidMount() {
    let match = this.state.match;
    this.props.dispatch(admin_info(match));
    //this.props.dispatch(getAllMenu());
  }

  componentWillReceiveProps(nextProps) {
    const refresh = this.props.info !== nextProps.info;
    let popupSetup = this.state.popupSetup;

    if (
      this.state.accountTypeList &&
      nextProps &&
      nextProps.info !== this.props.info &&
      nextProps.info.accountType
    ) {
      if (this.state.accountTypeList && this.state.accountTypeList.length > 0) {
        let accountName = this.state.accountTypeList.filter(el => {
          return el.value === nextProps.info.accountType;
        });
        if (accountName && accountName[0]) {
          this.setState({
            accountName: accountName[0].desc
          });
        }
      }
    }

    popupSetup["status"] = nextProps.status;
    popupSetup["types"] = nextProps.types;
    popupSetup["data"] = nextProps.data;
    popupSetup["title"] = nextProps.title;
    popupSetup["msg"] = nextProps.popupMsg;
    popupSetup["match"] = nextProps.match;
    popupSetup["actions"] = nextProps.popupActions;

    this.setState(
      {
        menuAllData: nextProps.menuAllData,
        navData: nextProps.navData,
        info: nextProps.info,
        popupSetup: popupSetup
      },
      () => {
        if (refresh) this.andmore();
      }
    );
  }

  popup(type, wantSettingsName) {
    let navData = Object.assign([], this.state.navData);
    let popupSetup = this.state.popupSetup;
    let page = this.props.match.params.page;
    let types = "";
    let pageName = "";
    let componentObjectKeyName = "";

    navData.map((item, i) => {
      if (item.id == 8) {
        item["children"].map((childrenItem, c) => {
          if (childrenItem.id == page) {
            pageName = childrenItem["menuName"];
            componentObjectKeyName = `${
              childrenItem.path.split("/")[2]
            }${wantSettingsName}`;
          }
        });
      }
    });

    switch (type) {
      case "edit":
        popupSetup["types"] = `form`;
        popupSetup["title"] = `更新${pageName}`;
        break;

      case "settings":
        popupSetup["types"] = `form`;
        switch (page) {
          case "9":
            switch (wantSettingsName) {
              case "role":
                popupSetup["title"] = lang["zh-cn"]["form"]["btn"]["addRole"];
                break;
              case "brand":
                popupSetup["title"] = lang["zh-cn"]["form"]["btn"]["addBrand"];
                break;
              case "pagecolumns":
                popupSetup["title"] =
                  lang["zh-cn"]["form"]["btn"]["addPagecolumns"];
                break;
              case "channel":
                popupSetup["title"] =
                  lang["zh-cn"]["form"]["btn"]["addChannel"];
                break;
              default:
                break;
            }
            break;
          case "10":
            if (wantSettingsName == "menu") {
              popupSetup["title"] = lang["zh-cn"]["form"]["btn"]["addMenu"];
            }
            break;

          case "13":
            if (wantSettingsName == "channel") {
              popupSetup["title"] = lang["zh-cn"]["form"]["btn"]["addCannel"];
            }
            break;

          case "14":
            if (wantSettingsName == "user") {
              popupSetup["title"] = lang["zh-cn"]["form"]["btn"]["addUser"];
            } else if (wantSettingsName == "brand") {
              popupSetup["title"] = lang["zh-cn"]["form"]["btn"]["addBrand"];
            }
            break;
        }
        break;

      default:
        popupSetup["types"] = `note`;
        popupSetup["title"] = `刪除${pageName}`;
    }

    popupSetup["status"] = "show";
    popupSetup["data"] = this.state.info;
    popupSetup["match"] = this.props.match;
    popupSetup["actions"] = [type, componentObjectKeyName];

    this.props.dispatch(popupAction(popupSetup));
  }

  changeEnabled(status) {
    this.props.dispatch(admin_enabled(this.state.match, status));
  }

  renderContent() {
    return this.state.infoLabel.map((item, i) => {
      if (item.columnEnName == "enabled") {
        if (this.state.match.params.page == 9) {
          if (this.state.info[item.columnEnName] != undefined) {
            return (
              <li key={i}>
                <ul>
                  <li className="label">
                    {item.columnName}
                    <span>:</span>
                  </li>
                  <li>
                    <span
                      className={`btn enabled ${
                        this.state.info[item.columnEnName]["enabledStatus"]
                      }`}
                      onClick={this.changeEnabled.bind(
                        this,
                        this.state.info[item.columnEnName]["enabledStatus"]
                      )}
                    >
                      {this.state.info[item.columnEnName]["text"]}
                    </span>
                  </li>
                </ul>
              </li>
            );
          }
        }
      } else if (item.columnEnName == "channelId") {
        return (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>
              <li>
                {this.state.info[item.columnEnName] != undefined &&
                  this.state.info[item.columnEnName].map((channelItem, c) => {
                    return <span key={c}>{channelItem.channelName}</span>;
                  })}
              </li>
            </ul>
          </li>
        );
      } else if (item.columnEnName == "roles") {
        return (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>
              <li>
                <div className="setItem">
                  {this.state.info[item.columnEnName] != undefined &&
                    this.state.info[item.columnEnName].map((item, i) => {
                      return (
                        <div key={i} className="item">
                          {item["roleName"]}
                        </div>
                      );
                    })}
                </div>
              </li>
            </ul>
          </li>
        );
      } else if (item.columnEnName == "accountType") {
        return (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>
              <li>
                <div>
                  {this.state.info[item.columnEnName] != undefined && (
                    <div key={i}>{this.state.accountName}</div>
                  )}
                </div>
              </li>
            </ul>
          </li>
        );
      } else if (item.columnEnName == "guarantee") {
        return (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>

              {/* {this.state.info["fieldToBeOperate"]} */}
              <li>
                <div>
                  {this.state.info[item.columnEnName] != undefined && (
                    <li>
                      {this.state.info[item.columnEnName] != ""
                        ? this.state.info[item.columnEnName]
                        : "--"}
                      {(this.state.info["fieldToBeOperate"] &&
                        this.state.info["fieldToBeOperate"] ===
                          "newUserBindCount") ||
                      this.state.info["fieldToBeOperate"] ===
                        "userBindCount" ? (
                        <span> 个</span>
                      ) : (
                        <span> 元</span>
                      )}
                    </li>
                  )}
                </div>
              </li>
            </ul>
          </li>
        );
      } else if (item.columnEnName == "brands") {
        let actionType = item.columnEnName;
        return this.state.info[item.columnEnName] ? (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>
              <li>
                <div className="setItem">
                  {this.state.info[item.columnEnName] != undefined &&
                    this.state.info[item.columnEnName].map((item, i) => {
                      return (
                        <div key={i} className="item">
                          {item["brandName"]}
                          <Remove
                            match={this.state.match}
                            item={item}
                            actionType={actionType}
                          />
                        </div>
                      );
                    })}
                </div>
              </li>
            </ul>
          </li>
        ) : (
          <div />
        );
      } else if (item.columnEnName == "users") {
        let actionType = item.columnEnName;
        return this.state.info[item.columnEnName] ? (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>
              <li>
                <div className="setItem">
                  {this.state.info[item.columnEnName] != undefined &&
                    this.state.info[item.columnEnName].map((item, i) => {
                      return (
                        <div key={i} className="item">
                          {item["userName"]}
                          <Remove
                            match={this.state.match}
                            item={item}
                            actionType={actionType}
                          />
                        </div>
                      );
                    })}
                </div>
              </li>
            </ul>
          </li>
        ) : (
          <div />
        );
      } else {
        return (
          <li key={i}>
            <ul>
              <li className="label">
                {item.columnName}
                <span>:</span>
              </li>
              <li>
                {this.state.info[item.columnEnName] != ""
                  ? this.state.info[item.columnEnName]
                  : "--"}
              </li>
            </ul>
          </li>
        );
      }
    });
  }

  andmore() {
    switch (_.get(this.props, "match.params.page", undefined)) {
      case "9":
        return this.case9andmore();
      case "10":
        return this.case10andmore();
      case "13":
        return this.case13andmore();
      case "14":
        return this.case14andmore();
      default:
        return;
    }
  }

  case9andmore() {
    const token = setup().token;

    this.setState({
      channelCard: null
    });

    if (this.state.info && this.state.info.accountType === 1) {
      this.fetchChannel({}, "user");
    }

    axios
      .get(setup().api[10].getMenu, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        const menulist = _.get(res, "data.data.list", []);
        const role = _.get(this.state, "info.roles", []).map(el => el.id);
        const menulistFillterByRole = this.menulistFillterByRole(
          menulist,
          role
        );
        const listDom = (
          <Tree checkable={false}>
            {this.menulistRender(menulistFillterByRole)}
          </Tree>
        );

        this.setState({
          andmore: (
            <li>
              <ul>
                <li class="label">
                  用戶菜單<span>:</span>
                </li>
                <li>{listDom}</li>
              </ul>
            </li>
          )
        });
      });
  }

  case10andmore() {
    const token = setup().token;
    axios
      .get(setup().api[10].getMenu, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        const menulist = _.get(res, "data.data.list", []);
        const roleId = this.state.info.id;
        const menulistFillterByRole = this.menulistFillterByRole(menulist, [
          roleId
        ]);
        const listDom = (
          <Tree checkable={false}>
            {this.menulistRender(menulistFillterByRole, true)}
          </Tree>
        );
        this.setState({
          andmore: (
            <li>
              <ul>
                <li class="label">
                  角色菜單<span>:</span>
                </li>
                <li>{listDom}</li>
              </ul>
            </li>
          )
        });
      });
    this.fetchUser({}, "role");
  }

  case13andmore() {
    this.fetchChannel({}, "brand");
    this.fetchUser({}, "brand");
  }

  case14andmore() {
    this.fetchChannelInfo({}, "user");
    this.fetchChannelInfo({}, "brand");
  }

  menulistFillterByRole = (list, roleId) => {
    return list
      .map(el => {
        if (el.children.length > 0)
          el.children = this.menulistFillterByRole(el.children, roleId);
        return !el.roles.some(role => roleId.includes(role.id)) ? null : el;
      })
      .filter(el => el);
  };

  menulistRender(list, ignoreEnabled = false) {
    return list
      .map(el => {
        if (!el.enabled && !ignoreEnabled) return null;
        if (el.children.length > 0) {
          return (
            <TreeNode title={el.menuName} key={el.id}>
              {this.menulistRender(el.children, ignoreEnabled)}
            </TreeNode>
          );
        } else {
          return <TreeNode title={el.menuName} key={el.id} />;
        }
      })
      .filter(el => el);
  }

  judgmentHideRemoveBtn(page) {
    if (page != "9") {
      if (
        !this.state.hideRemoveId[page].includes(
          Number(this.state.match.params.id)
        )
      ) {
        return (
          <li style={{ display: "inline-flex", marginRight: "10px" }}>
            <span
              className="btn action remove"
              onClick={this.popup.bind(this, "remove")}
            >
              <i className="icon far fa-trash-alt" />
              刪除
            </span>
          </li>
        );
      }
    }
  }

  judgmentHideChangeRoleBtn(page) {
    switch (page) {
      case "9":
        return (
          <ul>
            <li>
              <span
                className="btn action"
                onClick={this.popup.bind(this, "settings", "role")}
              >
                设置角色
              </span>
            </li>
            {this.state.info && this.state.info.accountType === 2 ? (
              <li>
                <span
                  className="btn action"
                  onClick={this.popup.bind(this, "settings", "brand")}
                >
                  设置品牌
                </span>
              </li>
            ) : null}
            <li>
              {_.get(this.state, "info.roles.length", 0) > 0 && (
                <span
                  className="btn action"
                  onClick={this.popup.bind(this, "settings", "pagecolumns")}
                >
                  設置菜單列
                </span>
              )}
            </li>

            {this.state.info && this.state.info.accountType === 1 ? (
              <li>
                <span
                  className="btn action"
                  onClick={this.popup.bind(this, "settings", "channel")}
                >
                  新增渠道
                </span>
              </li>
            ) : null}
          </ul>
        );
        break;

      case "10":
        return (
          <ul>
            <li>
              <span
                className="btn action"
                onClick={this.popup.bind(this, "settings", "menu")}
              >
                设置菜單
              </span>
            </li>
          </ul>
        );
        break;

      case "13":
        return (
          <ul>
            <li>
              <span
                className="btn action"
                onClick={this.popup.bind(this, "settings", "channel")}
              >
                新增渠道
              </span>
            </li>
          </ul>
        );
        break;

      case "14":
        return (
          <ul>
            <li>
              <span
                className="btn action"
                onClick={this.popup.bind(this, "settings", "user")}
              >
                新增用戶
              </span>
            </li>
            <li>
              <span
                className="btn action"
                onClick={this.popup.bind(this, "settings", "brand")}
              >
                新增品牌
              </span>
            </li>
          </ul>
        );
        break;

      default:
        return null;
    }
  }

  returnTitle() {
    let type = this.state.match.params.type;
    let page = this.state.match.params.page;
    let menuAllData = this.flatMenuData(this.state.menuAllData);
    let selectNavData = menuAllData.filter((el, i) => {
      return el["id"] == Number(page);
    });
    if (selectNavData[0] != undefined) {
      return selectNavData[0]["menuName"];
    } else {
      return "";
    }
  }

  flatMenuData(treeData, dfArr = []) {
    treeData.forEach(el => {
      dfArr.push(el);
      if (_.get(el, "children.length", 0) > 0) {
        this.flatMenuData(el.children, dfArr);
      }
    });
    return dfArr;
  }

  deleteChannel(text, record, val, t) {
    let token = setup().token;
    let apiUrl = "";
    let paramsObj = {};
    switch (val) {
      case "channel":
        switch (_.get(t.props, "match.params.page", undefined)) {
          case "9":
            paramsObj = {
              userChannelMapId: record.userChannelMapId
            };
            apiUrl = setup().api[14]["removeSettingUser"];
            break;
          case "13":
            paramsObj = {
              brandChannelMapId: record.brandChannelMapId
            };
            apiUrl = setup().api[14]["removeSettingBrand"];
          default:
            break;
        }
        break;
      case "user":
        paramsObj = {
          userChannelMapId: record.userChannelMapId
        };
        apiUrl = setup().api[14]["removeSettingUser"];
        break;
      case "brand":
        paramsObj = {
          brandChannelMapId: record.brandChannelMapId
        };
        apiUrl = setup().api[14]["removeSettingBrand"];
        break;
      default:
        break;
    }
    axios({
      method: "POST",
      headers: { Authorization: token },
      params: paramsObj,
      data: paramsObj,
      url: apiUrl
    }).then(res => {
      if (res && res.data && res.data.code === 0) {
        message.success("刪除成功");
        let pager = {};
        switch (val) {
          case "channel":
            pager = {
              current: 1,
              ...t.state.channelPagination
            };
            break;
          case "user":
            pager = {
              current: 1,
              ...t.state.userPagination
            };
            break;
          case "brand":
            pager = {
              current: 1,
              ...t.state.brandPagination
            };
            break;
          default:
            break;
        }
        t.handleTableChange(val, pager, {}, {});
      } else {
        if (res && res.msg) {
          message.error(res.msg);
        }
      }
    });
  }

  deleteUser(text, record, val, t) {
    let token = setup().token;
    let paramsObj = {};
    switch (_.get(t.props, "match.params.page", undefined)) {
      case "10":
        paramsObj = {
          userRoleMapId: record.userRoleMapId
        };
        break;
      case "13":
        paramsObj = {
          userBrandMapId: record.userBrandMapId
        };
        break;
      default:
        break;
    }

    let page = t.state.match.params.page;
    let apiUrl = setup().api[page]["removeSettingUser"];

    axios({
      method: "POST",
      headers: { Authorization: token },
      params: paramsObj,
      data: paramsObj,
      url: apiUrl
    }).then(res => {
      if (res && res.data && res.data.code === 0) {
        message.success("刪除成功");
        let pager = {
          current: 1,
          ...t.state.rolePagination
        };
        t.handleTableChange("getUser", pager, {}, {});
      } else {
        if (res && res.msg) {
          message.error(res.msg);
        }
      }
    });
  }

  handleTableChange = (fetch, pagination, filters, sorter) => {
    let pager = { pagination };

    switch (fetch) {
      case "channel":
        pager = { ...this.state.channelPagination };
        pager.current = pagination.current;
        this.setState({
          channelPagination: pager
        });

        switch (_.get(this.props, "match.params.page", undefined)) {
          case "9":
            this.fetchChannel(
              {
                results: pagination.pageSize,
                page: pagination.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters
              },
              "user"
            );
            break;
          case "13":
            this.fetchChannel(
              {
                results: pagination.pageSize,
                page: pagination.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters
              },
              "brand"
            );
            break;
          default:
            break;
        }

        break;
      case "user":
        pager = { ...this.state.userPagination };
        pager.current = pagination.current;
        this.setState({
          userPagination: pager
        });
        this.fetchChannelInfo(
          {
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters
          },
          "user"
        );
        break;

      case "brand":
        pager = { ...this.state.brandPagination };
        pager.current = pagination.current;
        this.setState({
          brandPagination: pager
        });
        this.fetchChannelInfo(
          {
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters
          },
          "brand"
        );
        break;

      case "getUser":
        pager = { ...this.state.rolePagination };
        pager.current = pagination.current;
        this.setState({
          rolePagination: pager
        });

        switch (_.get(this.props, "match.params.page", undefined)) {
          case "10":
            this.fetchUser(
              {
                ...this.state.roleSearch,
                page: pagination.current
              },
              "role"
            );
            break;
          case "13":
            this.fetchUser(
              {
                ...this.state.roleSearch,
                page: pagination.current
              },
              "brand"
            );
          default:
            break;
        }

        break;
      default:
        break;
    }
  };

  searchSubmit = (val, obj) => {
    let pager = {};
    let id = this.state.match.params.id;
    let params = {};
    switch (val) {
      case "userList":
        pager = { ...this.state.rolePagination };
        pager.current = 1;
        params = {
          page: pager.pager,
          ...obj
        };
        switch (_.get(this.props, "match.params.page", undefined)) {
          case "10":
            this.fetchUser(params, "role");
            break;
          case "13":
            this.fetchUser(params, "brand");
          default:
            break;
        }

        break;
      default:
        break;
    }
  };

  fetchUser = (params = {}, val) => {
    let token = setup().token;
    let id = this.state.match.params.id;
    let page = this.state.match.params.page;
    let apiUrl = setup().api[page][`${val}User`];
    const columns = [
      {
        title: `用戶名稱`,
        dataIndex: `userName`,
        sorter: true,
        width: "20%"
      },
      {
        title: `用戶ID`,
        dataIndex: `userId`,
        width: "20%"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record) => (
          <a onClick={() => this.showConfirm(text, record, "user")}>刪除</a>
        )
      }
    ];

    this.setState({ roleLoading: true });

    let paramsObj = {};
    let title = "";

    switch (val) {
      case "role":
        title = "角色下的用戶列表";
        paramsObj = {
          ...params,
          page: params.page,
          limit: 10,
          roleId: id
        };
        break;
      case "brand":
        title = "品牌下的用戶列表";
        paramsObj = {
          ...params,
          page: params.page,
          limit: 10,
          brandId: id
        };
        break;
      default:
        break;
    }
    axios
      .get(apiUrl, {
        headers: {
          Authorization: token
        },
        params: paramsObj
      })
      .then(res => {
        const rolePagination = { ...this.state.rolePagination };
        rolePagination.total = res.data.data.total;
        if (res.data && res.data.code === 0 && res.data.data) {
          this.setState({
            roleSearch: params,
            roleLoading: false,
            roleUserData: res.data.data.list,
            rolePagination,
            roleCard: (
              <Card title={title} bordered={false} style={{ width: "100%" }}>
                <Searchbar
                  key="searchUserList"
                  match={this.state.match}
                  selectOptions={[
                    { val: "userId", name: "用戶Id", type: "number" },
                    { val: "userName", name: "用戶名稱", type: "string" }
                  ]}
                  submit={obj => this.searchSubmit("userList", obj)}
                />
                <div class="admin-info-table">
                  <Table
                    columns={columns}
                    rowKey="userId"
                    dataSource={res.data.data.list}
                    pagination={rolePagination}
                    loading={false}
                    onChange={e => this.handleTableChange("getUser", e, e, e)}
                  />
                </div>
              </Card>
            )
          });
        }
      });
  };

  fetchChannel = (params = {}, val) => {
    let token = setup().token;
    let id = this.state.match.params.id;
    let apiUrl = setup().api[14][val];
    const columns = [
      {
        title: "渠道名称",
        dataIndex: "channelName",
        sorter: true,
        //render: name => `${name.first} ${name.last}`,
        width: "20%"
      },
      {
        title: "渠道ID",
        dataIndex: "channelId",
        // filters: [
        //   { text: "Male", value: "male" },
        //   { text: "Female", value: "female" }
        // ],
        width: "20%"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record) => (
          <a onClick={() => this.showConfirm(text, record, "channel")}>刪除</a>
        )
      }
    ];

    this.setState({ channelLoading: true });

    let paramsObj = {};
    let title = "";
    switch (val) {
      case "user":
        title = "用户下的渠道列表";
        paramsObj = {
          //...params,
          page: params.page,
          limit: 10,
          userId: id
        };
        break;
      case "brand":
        title = "品牌下的渠道列表";
        paramsObj = {
          //...params,
          page: params.page,
          limit: 10,
          brandId: id
        };
        break;
      default:
        break;
    }
    axios
      .get(apiUrl, {
        headers: {
          Authorization: token
        },
        params: paramsObj
      })
      .then(res => {
        const channelPagination = { ...this.state.channelPagination };
        // Read total count from server
        channelPagination.total = res.data.data.total;
        //pagination.total = 200;
        if (res.data && res.data.code === 0 && res.data.data) {
          this.setState({
            channelLoading: false,
            userChannelData: res.data.data.list,
            channelPagination,
            channelCard: (
              <Card title={title} bordered={false} style={{ width: "100%" }}>
                <div class="admin-info-table">
                  <Table
                    columns={columns}
                    rowKey="channelId"
                    dataSource={res.data.data.list}
                    pagination={channelPagination}
                    loading={false}
                    onChange={e => this.handleTableChange("channel", e, e, e)}
                  />
                </div>
              </Card>
            )
          });
        }
      });
  };

  fetchChannelInfo = (params = {}, val) => {
    let token = setup().token;
    let id = this.state.match.params.id;
    let apiUrl = setup().api[14][val];
    let columnName = {
      user: "用戶",
      brand: "品牌"
    };
    const columns = [
      {
        title: `${columnName[val]}名稱`,
        dataIndex: `${val}Name`,
        sorter: true,
        //render: name => `${name.first} ${name.last}`,
        width: "20%"
      },
      {
        title: `${columnName[val]}ID`,
        dataIndex: `${val}Id`,
        // filters: [
        //   { text: "Male", value: "male" },
        //   { text: "Female", value: "female" }
        // ],
        width: "20%"
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        render: (text, record) => (
          <a onClick={() => this.showConfirm(text, record, val)}>刪除</a>
        )
      }
    ];

    let title = "";
    switch (val) {
      case "user":
        title = "渠道下的用户列表";
        this.setState({ userLoading: true });
        break;
      case "brand":
        title = "渠道下的品牌列表";
        this.setState({ brandLoading: true });
        break;
      default:
        break;
    }

    axios
      .get(apiUrl, {
        headers: {
          Authorization: token
        },
        params: {
          //...params,
          page: params.page,
          limit: 10,
          channelId: id
        }
      })
      .then(res => {
        let userPagination = {};
        let brandPagination = {};

        if (res.data && res.data.code === 0 && res.data.data) {
          switch (val) {
            case "user":
              userPagination = { ...this.state.userPagination };
              userPagination.total = res.data.data.total;

              this.setState({
                userLoading: false,
                channelUserData: res.data.data.list,
                userPagination,
                userCard: (
                  <Card
                    title={title}
                    bordered={false}
                    style={{ width: "100%", marginBottom: "20px" }}
                  >
                    <div class="admin-info-table">
                      <Table
                        columns={columns}
                        rowKey="userId"
                        dataSource={res.data.data.list}
                        pagination={userPagination}
                        loading={false}
                        onChange={e => this.handleTableChange("user", e, e, e)}
                      />
                    </div>
                  </Card>
                )
              });

              break;
            case "brand":
              brandPagination = { ...this.state.brandPagination };
              brandPagination.total = res.data.data.total;

              this.setState({
                brandLoading: false,
                channelBrandData: res.data.data.list,
                brandPagination,
                brandCard: (
                  <Card
                    title={title}
                    bordered={false}
                    style={{ width: "100%", marginBottom: "20px" }}
                  >
                    <div class="admin-info-table">
                      <Table
                        columns={columns}
                        rowKey="brandId"
                        dataSource={res.data.data.list}
                        pagination={brandPagination}
                        loading={false}
                        onChange={e => this.handleTableChange("brand", e, e, e)}
                      />
                    </div>
                  </Card>
                )
              });

              break;
            default:
              break;
          }
        }
      });
  };

  showConfirm(text, record, val) {
    const confirm = Modal.confirm;
    let page = this.state.match.params.page;
    let t = this;
    let title = "";
    let callFn = null;
    switch (page) {
      case "9":
        title = `確定刪除${record.channelName}?`;
        callFn = this.deleteChannel;
        break;
      case "10":
        title = `確定刪除${record.userName}?`;
        callFn = this.deleteUser;
        break;
      case "13":
        switch (val) {
          case "channel":
            title = `確定刪除${record.channelName}?`;
            callFn = this.deleteChannel;
            break;
          case "user":
            title = `確定刪除${record.userName}?`;
            callFn = this.deleteUser;
            break;
          default:
            break;
        }
        break;
      case "14":
        switch (val) {
          case "user":
            title = `確定刪除${record.userName}?`;
            break;
          case "brand":
            title = `確定刪除${record.brandName}?`;
            break;
          default:
            break;
        }
        callFn = this.deleteChannel;
        break;
      default:
        break;
    }
    confirm({
      okText: "刪除",
      cancelText: "取消",
      title: title,
      onOk() {
        callFn(text, record, val, t);
      },
      onCancel() {}
    });
  }

  render() {
    const state = this.state;
    let page = this.state.match.params.page;

    return (
      <main>
        <Sitmap />
        <div className="main-content">
          <div className="main-content-block">
            <Card
              title={`${this.returnTitle()} - 个别资料`}
              bordered={false}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <ul
                className="block-title-action"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  minWidth: "500px",
                  textAlign: "right"
                }}
              >
                {this.judgmentHideRemoveBtn(page)}
                <li style={{ display: "inline-flex" }}>
                  <span
                    className="btn action edit"
                    onClick={this.popup.bind(this, "edit", "")}
                  >
                    <i className="icon fas fa-pencil-alt " />
                    修改
                  </span>
                </li>
              </ul>
              <ul className="list">
                {this.renderContent()}
                {this.state.andmore}
              </ul>
            </Card>

            {this.state.channelCard}
            {this.state.userCard}
            {this.state.brandCard}
            {this.state.roleCard}

            <section className="main-content-block-action">
              {this.judgmentHideChangeRoleBtn(page)}
            </section>
          </div>
        </div>
      </main>
    );
  }
}
