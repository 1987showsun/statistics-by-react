import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

import { update } from "../../actions/admin/update";

@connect((state, props) => {
  return {
    popupMsg     : state.popup.msg,
    seleEditData: state.popup.data
  };
})
export default class MenuEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      msg  : props.popupMsg,
      formObject: {
        id: props.seleEditData["id"],
        menuName: props.seleEditData["menuName"],
        sort: props.seleEditData["sort"],
        pid: props.seleEditData["pid"],
        uri: props.seleEditData["uri"],
        path: props.seleEditData["path"],
        iconClass: props.seleEditData["iconClass"],
        enabled:
          props.seleEditData["enabled"]["enabledStatus"] == true ? "1" : "0"
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg                   : nextProps.popupMsg
    })
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
    let formObject = Object.assign({},this.state.formObject);
    let match      = this.state.match;

    formObject['path'] = encodeURIComponent( formObject['path'] );
    formObject['uri']  = encodeURIComponent( formObject['uri'] );

    this.props.dispatch(update(match, formObject));
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
                    type="text"
                    name="sort"
                    value={this.state.formObject["sort"]}
                    onChange={this.handleChange.bind(this)}
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
                    type="text"
                    name="pid"
                    value={this.state.formObject["pid"]}
                    onChange={this.handleChange.bind(this)}
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
                    value={this.state.formObject["enabled"]}
                    onChange={this.handleChange.bind(this)}
                  >
                    <option value="0">0 隐藏，代表的是这是一个操作权限</option>
                    <option value="1">1 显示，代表的是这是一个菜单</option>
                  </select>
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
