import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Tree } from "antd";

const TreeNode = Tree.TreeNode;

//Components
import CheckBox from "../input/checkBox";

//Actions
import { setup } from "../../actions/setup";
import { update_role_menus } from "../../actions/admin/update";

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    allRoleList: state.admin.roleList,
    loadingState: state.loading.state
  };
})
export default class RoleEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus: "hide",
      match: props.match,
      msg: props.popupMsg,
      allRoleList: props.allRoleList,
      formObject: {
        id: props.seleEditData["id"],
        menuIds: []
      },
      treeDom: null,
      ready: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      allRoleList: nextProps.allRoleList
    });
  }

  componentDidMount() {
    const token = setup().token;
    axios
      .get(setup().api[10].getMenu, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        const menulist = _.get(res, "data.data.list", []);
        const roleId = this.props.seleEditData["id"];
        const roleMenuIdArr = this.filterRoleMenu(menulist, roleId);
        const formObject = this.state.formObject;
        formObject.menuIds = [
          ...roleMenuIdArr.checked,
          ...roleMenuIdArr.halfChecked
        ];

        this.setState({
          treeDom: (
            <Tree
              checkable
              defaultCheckedKeys={roleMenuIdArr}
              onCheck={this.onCheck}
            >
              {this.menulistRender(menulist, true)}
            </Tree>
          ),
          ready: true,
          formObject
        });
      });
  }

  menulistRender(list, ignoreEnabled = false) {
    return list.map(el => {
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
    });
  }

  filterRoleMenu(treeData, id, dfArr = { checked: [], halfChecked: [] }) {
    treeData.forEach(el => {
      if (el.roles.some(role => role.id === id)) {
        const children = _.get(el, "children", []);
        const isHalfChecked = children.some(
          child => !child.roles.some(role => role.id == id)
        );
        isHalfChecked
          ? dfArr.halfChecked.push(el.id.toString())
          : dfArr.checked.push(el.id.toString());
        if (children.length > 0) {
          this.filterRoleMenu(children, id, dfArr);
        }
      }
    });
    return dfArr;
  }

  checkBoxBackArray(array) {
    let formObject = Object.assign({}, this.state.formObject);
    formObject["menuIds"] = array.map((item, i) => {
      return item.checkBoxId;
    });

    this.setState({
      formObject: formObject
    });
  }

  onCheck = (checkedKeys, info) => {
    const formObject = this.state.formObject;
    formObject.menuIds = [...checkedKeys, ...info.halfCheckedKeys];
    this.setState({ formObject });
  };

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.ready) return;
    let formObject = Object.assign({}, this.state.formObject);
    let match = this.state.match;
    this.props.dispatch(update_role_menus(match, formObject));
  }

  selectSwitch(status) {
    this.setState({
      selectOpenStatus: status
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li style={{ overflow: "auto", maxHeight: "500px" }}>
                {this.props.loadingState && (
                  <div className="loadingBox">
                    <div className="lds-css ng-scope">
                      <div className="lds-spinner" style={{ height: "100%" }}>
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  </div>
                )}
                {this.state.treeDom}
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
