import React, { Component } from "react";
import { connect } from "react-redux";

//新增的 Component form
import FormUserAdd from "./user_add";
import FormRoleAdd from "./role_add";
import FormMenuAdd from "./menu_add";
import FormBrandAdd from "./brand_add";
import FormDeductionRule from "./deductionRule_add";
import FormPageColumns from "./pageColumns_add";
import FormChannel from "./channel_add";
import FormUserIpConfig from "./userIpConfig_add";

//更新的 Component form
import EditUser from "./user_edit";
import EditUserPassword from "./user_editpassword";
import EditRole from "./role_edit";
import EditMenu from "./menu_edit";
import EditPageColumns from "./pageColumns_edit";
import EditBrand from "./brand_edit";
import EditChannel from "./channel_edit";
import EditDeductionRule from "./deductionRule_edit";
import EditUserIpConfig from "./userIpConfig_edit";

//設置的 Component form
import SettingsUserRole from "./user_role";
import SettingsUserBrand from "./user_brand";
import SettingsUserPageColumns from "./user_pageColumns";
import SettingsUserChannel from "./user_channel";
import SettingsRoleMenu from "./role_menus";
import SettingsChannelUser from "./channel_user";
import SettingsChannelBrand from "./channel_brand";
import SettingsBrandChannel from "./brand_channel";

import RemoveAll from "./remove";
import LoadModuleStyle1 from "../module/loadModuleStyle1";

@connect((state, props) => {
  return {
    navData: state.nav.navData,
    popupStatus: state.popup.status,
    popupTypes: state.popup.types,
    popupData: state.popup.data,
    popupTitle: state.popup.title,
    popupMsg: state.popup.msg,
    popupActions: state.popup.actions,
    formLoad: state.loading.formLoading
  };
})
export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formLoad: props.formLoad,
      match: props.match,
      components: {
        add: {
          user: FormUserAdd,
          role: FormRoleAdd,
          menu: FormMenuAdd,
          brand: FormBrandAdd,
          deductionRule: FormDeductionRule,
          pageColumns: FormPageColumns,
          channel: FormChannel,
          userIpConfig: FormUserIpConfig
        },
        edit: {
          user: EditUser,
          role: EditRole,
          menu: EditMenu,
          pageColumn: EditPageColumns,
          brand: EditBrand,
          channel: EditChannel,
          deductionRule: EditDeductionRule,
          userPassword: EditUserPassword,
          userIpConfig: EditUserIpConfig
        },
        remove: {
          all: RemoveAll
        },
        settings: {
          userrole: SettingsUserRole,
          userbrand: SettingsUserBrand,
          userpagecolumns: SettingsUserPageColumns,
          userchannel: SettingsUserChannel,
          rolemenu: SettingsRoleMenu,
          channeluser: SettingsChannelUser,
          channelbrand: SettingsChannelBrand,
          brandchannel: SettingsBrandChannel
        }
      },
      match: props.match,
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
    popupSetup["msg"] = nextProps.popupMsg;
    popupSetup["match"] = nextProps.match;
    popupSetup["actions"] = nextProps.popupActions;

    this.setState({
      popupSetup: popupSetup,
      formLoad: nextProps.formLoad
    });
  }

  selectReanderFormView() {
    let type =
      this.state.match.params != undefined ? this.state.match.params.type : "";
    let page =
      this.state.match.params != undefined ? this.state.match.params.page : "";
    let popupSetup = this.state.popupSetup;
    let actionsType = popupSetup.actions[0];
    let actionsName = popupSetup.actions[1];
    let ComponentName;

    switch (type) {
      case "admin":
        ComponentName = this.state.components[actionsType][actionsName];

        return <ComponentName match={this.state.match} />;
        break;

      default:
        ComponentName = this.state.components[actionsType][actionsName];

        return <ComponentName match={this.state.match} />;
        return "未设置表单组件";
    }
  }

  render() {
    return (
      <div className="form">
        <div
          className={`form-loading ${
            this.state.formLoad == false ? "" : "show"
          }`}
        >
          <LoadModuleStyle1 />
        </div>
        {this.selectReanderFormView()}
      </div>
    );
  }
}
