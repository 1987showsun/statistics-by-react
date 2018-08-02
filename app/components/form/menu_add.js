import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Actions
import { admin_add } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    limit: state.admin.limit,
    levelList: state.admin.levelList,
    enabledList: state.admin.enabledList
  };
})
export default class MenuAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      limit: props.limit,
      msg: props.popupMsg,
      levelList: props.levelList,
      enabledList: props.enabledList,
      formObject: {
        menuName: "",
        sort: "",
        pid: "",
        uri: "",
        path: "",
        iconClass: "",
        enabled: 0
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["enabled"] = nextProps.enabledList[0]["value"];

    this.setState({
      msg: nextProps.popupMsg,
      limit: nextProps.limit,
      levelList: nextProps.levelList,
      enabledList: nextProps.enabledList,
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
    let limit      = this.state.limit;
    let match      = this.state.match;
    let formObject = this.state.formObject;
    this.props.dispatch(admin_add(match, limit, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">菜单名称</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="menuName"
                    value={this.state.formObject["menuName"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="菜单名称"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">排序权重</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="sort"
                    value={this.state.formObject["sort"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="排序权重"
                    min="1"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">所属菜单</li>
              <li>
                <div className="input-box">
                  <input
                    type="number"
                    name="pid"
                    value={this.state.formObject["pid"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="所属菜单"
                    min="1"
                    required
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">路径匹配规则</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="uri"
                    value={this.state.formObject["uri"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="路径匹配规则"
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">菜单路径</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="path"
                    value={this.state.formObject["path"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="菜单路径"
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">icon class name</li>
              <li>
                <div className="input-box">
                  <input
                    type="text"
                    name="iconClass"
                    value={this.state.formObject["iconClass"]}
                    onChange={this.handleChange.bind(this)}
                    placeholder="icon class name"
                  />
                </div>
              </li>
            </ul>
          </li>
          <li>
            <ul>
              <li className="label">启用状态</li>
              <li>
                <div className="input-box" data-type="select">
                  <select
                    name="enabled"
                    onChange={this.handleChange.bind(this)}
                  >
                    {this.state.enabledList &&
                      this.state.enabledList.length >= 0 &&
                      this.state.enabledList.map((item, i) => {
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
          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">新增</button>
          </li>
        </ul>
      </form>
    );
  }
}
