import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { getAllMenu } from "../../actions/getAllData";
import { admin_add, admin_list } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    menuData: state.admin.menuList,
    limit: state.admin.limit
  };
})
export default class PageColumnsAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      limit: props.limit,
      menuData: props.menuData,
      msg: props.popupMsg,
      formObject: {
        columnName: "",
        columnEnName: "",
        menuId: "",
        sort: 1
      }
    };
  }

  componentDidMount() {
    let nowPageNumber = this.state.nowPageNumber;
    let match = this.state.match;
    let limit = this.state.limit;

    this.props.dispatch(admin_list(match, limit));

    //this.props.dispatch(getAllMenu());
  }

  componentWillReceiveProps(nextProps) {
    let formObject = this.state.formObject;
    formObject["menuId"] = nextProps.menuData[0]["id"];

    this.setState({
      msg: nextProps.popupMsg,
      menuData: nextProps.menuData,
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
    let limit = this.state.limit;
    let match = this.state.match;
    let formObject = this.state.formObject;
    this.props.dispatch(admin_add(match, limit, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li data-class="label">菜單列中文名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="columnName"
                    value={this.state.formObject["columnName"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="菜單列中文名称"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li data-class="label">菜單列英文名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="columnEnName"
                    value={this.state.formObject["columnEnName"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="菜單列英文名称"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li data-class="label">所属菜单</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="menuId"
                    value={this.state.formObject["menuId"]}
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.menuData.map((item, i) => {
                      return (
                        <option key={i} value={item["id"]}>
                          {item["menuName"]}
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
              <li data-class="label">排序权重</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="sort"
                    value={this.state.formObject["sort"]}
                    onChange={this.handleChange.bind(this)}
                    min="1"
                    required
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
