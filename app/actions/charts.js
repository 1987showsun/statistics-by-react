import axios from "axios";
import $ from "jquery";
import { setup } from "./setup";
import { getToday, getDate } from "../public/javascripts/date";

export function allChannelList() {
  return function(dispatch) {

    let axiosUrl = setup().api["3"]["channel"];
    let token    = setup().token;

    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData        = res.data;
        let code           = resData.code;
        let msg            = resData.msg;
        let allChannelList = resData.data.list;

        dispatch({
          type: "ALL_CHANNEL_LIST",
          code: code,
          msg: msg,
          data: allChannelList
        });
      });
  };
}

export function chargeTotalEveryHour(searchFormObject) {
  return function(dispatch) {

    let params     = searchFormObject || "";
    let axiosUrl   = setup().api["4"]["list"];

    returnAxios("get", axiosUrl,params,dispatch).then((res)=>{

      let categoryList = res['data']['categoryList'];
      let data         = res['data']['chargeSumPlusProxyChargeSumEveryHourList'];
      let dataPoints   = {
        labels   : Object.assign([],categoryList),
        datasets : [{}]
      };

      dataPoints['datasets'][0]['label']            = "今日累計";
      dataPoints['datasets'][0]['backgroundColor']  = 'transparent';
      dataPoints['datasets'][0]['borderColor']      = 'rgb(255, 99, 132)';
      dataPoints['datasets'][0]['data']             = data;
      
      dispatch({
        type      : "CHANGE_TOTAL_EVERY_HOUR",
        data      : dataPoints
      });
    })
  };
}

export function onlineUser(searchFormObject) {
  return function(dispatch) {

    let params         = searchFormObject || "";
    let axiosUrl       = setup().api["5"]["list"];

    returnAxios("get", axiosUrl,params,dispatch).then((res)=>{
      let categoryList  = res['data']['categoryList'];
      let data          = res['data']['countList'];
      let dataPoints    = {
        labels   : Object.assign([],categoryList),
        datasets : [{}]
      };

      dataPoints['datasets'][0]['label']            = "今日累計";
      dataPoints['datasets'][0]['backgroundColor']  = 'transparent';
      dataPoints['datasets'][0]['borderColor']      = 'rgb(255, 99, 132)';
      dataPoints['datasets'][0]['data']             = data;

      dispatch({
        type    : "ONLINE_USER_SET",
        data    : dataPoints
      });
    });
  };
}

export function chargeUserCountEveryHour(searchFormObject) {
  return function(dispatch) {

    let params = searchFormObject || "";
    let axiosUrl = setup().api["6"]["list"];

    returnAxios("get", axiosUrl,params,dispatch).then((res)=>{

      let categoryList = res['data']['categoryList'];
      let data         = res['data']['chargeUserCountEveryHourList'];
      let dataPoints   = {
        labels   : Object.assign([],categoryList),
        datasets : [{}]
      };

      dataPoints['datasets'][0]['label']            = "今日累計";
      dataPoints['datasets'][0]['backgroundColor']  = 'transparent';
      dataPoints['datasets'][0]['borderColor']      = 'rgb(255, 99, 132)';
      dataPoints['datasets'][0]['data']             = data;

      dispatch({
        type    : "CHANGE_USER_COUNT_EVERY_HOUR",
        data    : dataPoints
      });
    });
  };
}

export function registrationEveryHour(searchFormObject) {
  return function(dispatch) {

    let params        = searchFormObject || "";
    let axiosUrl      = setup().api["7"]["list"];

    returnAxios("get", axiosUrl,params,dispatch).then((res)=>{

      let categoryList = res['data']['categoryList'];
      let data         = res['data']['newUserCountEveryHourList'];
      let dataPoints   = {
        labels   : Object.assign([],categoryList),
        datasets : [{}]
      };

      dataPoints['datasets'][0]['label']            = "今日累計";
      dataPoints['datasets'][0]['backgroundColor']  = 'transparent';
      dataPoints['datasets'][0]['borderColor']      = 'rgb(255, 99, 132)';
      dataPoints['datasets'][0]['data']             = data;

      dispatch({
        type     : "REGISTRATION_EVERY_HOUR",
        data     : dataPoints
      });
    });
  };
}

const returnAxios = (method, axiosUrl,params,dispatch) => {
  let token = setup().token;
  
  return axios({
    method  : method,
    url     : axiosUrl,
    params  : params,
    headers : {
      Authorization: token
    }
  }).then(res => {

    let resData      = res['data'];
    let code         = resData['code'];
    let msg          = resData['msg'];

    dispatch({
      type : "CHARTS_AJAX_STATUS",
      code : code,
      msg  : msg
    })

    return resData;
  });
};