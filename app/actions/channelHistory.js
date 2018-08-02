import axios from "axios";
import $ from "jquery";
import { loading } from "./loading";
import { setup } from "./setup";
import { changeDate } from "../public/javascripts/date";

let apiUrl = setup().apiUrl;
let devStatus = setup().devStatus;
let token = setup().token;

export function channelHistoryList(searchFormObject) {
  return function(dispatch) {
    let params = ``;
    let token = setup().token;
    let axiosUrl = `${setup().api["3"]["list"]}`;

    if (searchFormObject != undefined) {
      Object.keys(searchFormObject).map((key, i) => {
        if (i == 0) {
          params = `?${key}=${searchFormObject[key]}`;
        } else {
          params = `${params}&${key}=${searchFormObject[key]}`;
        }
      });
    }

    if (!searchFormObject) {
      return loading(true)(dispatch);
    }

    loading(false)(dispatch);
    axios
      .get(`${axiosUrl}${params}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData = res.data;
        let msg = resData.msg;
        let code = resData.code;
        let total = resData.data.total;
        let list = [];
        let channelNames = "";

        if (resData.data.hasOwnProperty("list")) {
          list = resData.data.list;
          channelNames = resData.data.channelNames;
          if (list && list.length >= 0) {
            list.map((item, i) => {
              item["createTime"] = changeDate(item["createTime"]);
            });
          }
        }

        loading(true)(dispatch);
        dispatch({
          type: "CHANNEL_HISTORY_LIST_SET",
          code,
          msg,
          channelNames: channelNames,
          list,
          total,
          params,
          limit: searchFormObject.limit
        });
      });
  };
}
