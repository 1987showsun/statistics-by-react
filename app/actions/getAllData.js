import axios from "axios";
import $ from "jquery";
import { setup } from "./setup";
import { getDate } from "../public/javascripts/date";

let token = setup().token;

export function clearData() {
  return function(dispatch) {
    dispatch({
      type: "SEARCH_SET",
      code: -1,
      msg: "",
      data: []
    });
  };
}

export function getAllMenu() {
  return function(dispatch) {
    let axiosUrl = setup().api["10"]["getMenu"];

    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData = res.data;
        let code = resData.code;
        let msg = resData.msg;
        let list = resData.data.list;
        if (list && list.length >= 0) {
          list.map((item, i) => {
            item["menuIds"] = item["checkBoxId"] = item["id"];
            item["menuNames"] = item["checkBoxName"] = item["menuName"];
          });
        }
        dispatch({
          type: "SEARCH_SET",
          code: code,
          msg: msg,
          data: list
        });
      });
  };
}

export function getAllBrand() {
  return function(dispatch) {
    let axiosUrl = setup().api["13"]["getAllBrand"];
    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData = res.data;
        let code = resData.code;
        let msg = resData.msg;
        let list = resData.data.list;
        if (list && list.length >= 0) {
          list.map((item, i) => {
            item["brandIds"] = item["checkBoxId"] = item["id"];
            item["brandNames"] = item["checkBoxName"] = item["brandName"];
          });
        }
        dispatch({
          type: "SEARCH_SET",
          code: code,
          msg: msg,
          data: list
        });
      });
  };
}

export function getData(checkBoxSetup) {
  return function(dispatch) {
    let params = "";
    let wantUseApi = checkBoxSetup["wantUseApi"];

    switch (wantUseApi) {
      case "searchChannel":
        if (checkBoxSetup.hasOwnProperty(checkBoxSetup["inputName"])) {
          params = `?channelName=${checkBoxSetup["channelName"]}`;
        }
        break;

      case "searchUserChannel":
        if (checkBoxSetup.hasOwnProperty(checkBoxSetup["inputName"])) {
          params = `?page=1&limit=100&channelName=${
            checkBoxSetup["channelName"]
          }`;
        }
        break;

      case "searchUser":
        if (checkBoxSetup.hasOwnProperty(checkBoxSetup["inputName"])) {
          params = `?userName=${checkBoxSetup["userName"]}`;
        }
        break;
    }

    let axiosUrl = `${setup().api["makeUp"][wantUseApi]}${params}`;

    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData = res.data;
        let code = resData.code;
        let msg = resData.msg;
        let list = resData.data.list;
        if (list && list.length >= 0) {
          switch (wantUseApi) {
            case "searchChannel":
              list.map((item, i) => {
                item["channelIds"] = item["checkBoxId"] = item["id"];
                item["channelNames"] = item["checkBoxName"] =
                  item["channelName"];
              });
              break;

            case "searchUserChannel":
              list.map((item, i) => {
                item["channelIds"] = item["checkBoxId"] = item["channelId"];
                item["channelNames"] = item["checkBoxName"] =
                  item["channelName"];
              });
              break;

            case "searchUser":
              list.map((item, i) => {
                item["userIds"] = item["checkBoxId"] = item["id"];
                item["userNames"] = item["checkBoxName"] = item["userName"];
              });
              break;

            case "allBrand":
              list.map((item, i) => {
                item["brandIds"] = item["checkBoxId"] = item["id"];
                item["brandNames"] = item["checkBoxName"] = item["brandName"];
              });
              break;

            case "allMenu":
              list.map((item, i) => {
                item["menuIds"] = item["checkBoxId"] = item["id"];
                item["menuNames"] = item["checkBoxName"] = item["menuName"];
              });
              break;

            case "allRole":
              list.map((item, i) => {
                item["roleIds"] = item["checkBoxId"] = item["id"];
                item["roleNames"] = item["checkBoxName"] = item["roleName"];
              });
              break;
          }
        }

        dispatch({
          type: "SEARCH_SET",
          code: code,
          msg: msg,
          data: list
        });
      });
  };
}
