import axios from "axios";
import { admin_info } from "./info";
import { setup } from "../setup";
import { popupAction } from "../popup";
import { message } from "antd";
import { loadingForm } from "../loading";
import { logout } from "../login";

let token = setup().token;

export function update(match, formObject) {
  return function(dispatch) {
    let page     = match.params!=undefined? match.params.page : "";
    let axiosUrl = `${setup().api[page]["edit"]}`;

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function updateUserPassWord(formObject) {
  return function(dispatch) {
    
    let axiosUrl = `${setup().api["login"]["editPassWord"]}`;
    
    delete formObject['userId'];
    delete formObject['firstPwd'];

    returnAxios('post',axiosUrl,formObject).then(res=>{

      let code    = res['code'];

      if (code == 0) {
        logout()(dispatch);
        dispatch({
          type        : "LOGOUT_STATUS",
          code        : code,
          loginStatus : true
        })
      }
    })
  }
};

export function update_user_role(match, formObject) {
  return function(dispatch) {
    let page       = match.params.page;
    let axiosUrl   = `${setup().api[page]["editRole"]}`;

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function update_user_brand(match, formObject) {
  return function(dispatch) {
    let page               = match.params.page;
    let axiosUrl           = `${setup().api[page]["editBrand"]}`;

    formObject['brandIds'] = formObject["brandIds"].toString();
    delete formObject['brandNames'];

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function update_role_menus(match, formObject) {
  return function(dispatch) {

    let page      = match.params.page;
    let axiosUrl  = `${setup().api[page]["addMenus"]}`;

    formObject["menuIds"] = formObject["menuIds"].toString();

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function update_channel_brand(match, formObject) {
  return function(dispatch) {

    let page = match.params.page;
    let axiosUrl = `${setup().api[page]["settingBrand"]}`;

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function update_channel_user(match, formObject) {
  return function(dispatch) {

    let page     = match.params.page;
    let axiosUrl = `${setup().api[page]["settingUser"]}`;

    delete formObject['userNames'];

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function update_user_menuPageColumn(match, formObject) {
  return function(dispatch) {

    let page     = match.params.page;
    let axiosUrl = `${setup().api[page]["editMenuPageColumn"]}`;

    formObject.pageColumnIds = formObject.pageColumnIds.toString();
    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

export function update_user_channel(match, formObject) {
  return function(dispatch) {
    let page      = match.params.page;
    let axiosUrl  = `${setup().api[page]["settingChannel"]}`;

    formObject["channelId"] = formObject["channelId"].toString();
    formObject["userId"]    = formObject["userId"].toString();

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });

  };
}

export function update_brand_channel(match, formObject) {
  return function(dispatch) {

    let page = match.params.page;
    let axiosUrl = `${setup().api[page]["settingChannel"]}`;
    
    formObject["channelId"] = formObject["channelId"].toString()
    formObject["brandId"]   = formObject["brandId"].toString();

    loadingForm(true)(dispatch);
    returnAxios('post',axiosUrl,formObject).then(res=>{
      result(match, res, dispatch);
    });
  };
}

const result = (match, res, dispatch) => {
  let popupSetup = {
    status  : "hide",
    types   : "",
    data    : [],
    title   : "",
    msg     : "",
    actions : []
  };
  let code = res['code'];
  loadingForm(false)(dispatch);
  if (code == 0) {
    //成功 reload data
    popupAction(popupSetup)(dispatch);
    message.success("修改完成");
    admin_info(match)(dispatch);
  } else {
    dispatch({
      type    : "POPUP_MSG",
      msg     : res['msg']
    });
  }
};

const returnAxios = (method, axiosUrl, formObject) => {
  let token = setup().token;
  return axios({
    method : method,
    url    : axiosUrl,
    headers: {
      Authorization: token
    },
    params: formObject  // 会将参数拼接到url中
  }).then(res => {
    return res['data'];
  });
};