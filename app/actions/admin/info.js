import axios from "axios";
import { setup } from "../setup";
import { loading } from "../loading";
import { changeDate } from "../../public/javascripts/date";

//Actions
import { admin_list } from "./list";

let token = setup().token;

export function admin_info(match) {
  return function(dispatch) {
    let page     = match.params.page;
    let id       = match.params.id;
    let apiUrl   = setup().api[page]["info"];
    let axiosUrl = `${apiUrl}?id=${id}`;
    let token    = setup().token;

    switch (page) {
      case "9":
        axiosUrl = `${apiUrl}?userId=${id}`;
        //admin_get_all_role()(dispatch);
        admin_get_user_pageColumns(match)(dispatch);
        break;

      case "15":
        //為了取 deductionRuleTypeList 給扣量修改彈跳視窗下拉式選單使用
        admin_list(match, 10)(dispatch);
        break;

      default:
        break;
    }
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
        let info = resData.data.info;

        if (info && info["createTimestamp"]) {
          info["createTimestamp"] = changeDate(info["createTimestamp"]);
        }
        if (info && info["modifiedTimestamp"]) {
          info["modifiedTimestamp"] = changeDate(info["modifiedTimestamp"]);
        }

        if (info.hasOwnProperty("brands")) {
          if (info["brands"] && info["brands"].length >= 0) {
            info["brands"].map((item, i) => {
              item["createTimestamp"] = changeDate(item["createTimestamp"]);
              item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
            });
          }
        }

        if (info.hasOwnProperty("roles")) {
          if (info["roles"] && info["roles"].length > 0) {
            info["roles"].map((item, i) => {
              item["createTimestamp"] = changeDate(item["createTimestamp"]);
              item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
            });
          }
        }

        if (info.hasOwnProperty("enabled")) {
          if (info["enabled"]) {
            info["enabled"] = {
              enabledStatus: info["enabled"],
              text: "启用中"
            };
          } else {
            info["enabled"] = {
              enabledStatus: info["enabled"],
              text: "停用中"
            };
          }
        }
        if (info.hasOwnProperty("nickName")) {
          delete info["nickName"];
        }
        if (info.hasOwnProperty("beginTimestamp")) {
          if (info["beginTimestamp"]) {
            info["beginTimestamp"] = changeDate(info["beginTimestamp"]);
          }
        }
        if (info.hasOwnProperty("endTimestamp")) {
          if (info["endTimestamp"]) {
            info["endTimestamp"] = changeDate(info["endTimestamp"]);
          }
        }

        switch (page) {
          case "14":
            channel_info_add_user_brand(match, resData, dispatch);
            break;

          case "15":
            deductionRule_change_channel_to_cn(resData, dispatch);
            break;

          default:
            dispatch({
              type: "ADMIN_INFO",
              code: code,
              msg: msg,
              info: info
            });
        }
      });
  };
}

export function admin_enabled(match, status) {
  return function (dispatch) {
    let page = match.params.page;
    let id = match.params.id;
    status = status ? "false" : "true";
    let axiosUrl = `${setup().api[page]["enabled" + status]}?userId=${id}`;

    axios
      .post(
        `${axiosUrl}`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        admin_info(match)(dispatch);
      });
  };
}

export function admin_get_all_role(match, status) {
  return function (dispatch) {
    let axiosUrl = setup().api["roleAllList"]["list"];
    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData = res.data;
        let list = resData.data.list;
        dispatch({
          type: "ADMIN_ROLE_LIST_ALL",
          data: list
        });
      });
  };
}

const channel_info_add_user_brand = (match, resData, dispatch) => {
  let info = resData["data"]["info"];
  dispatch({
    type: "ADMIN_INFO",
    code: resData.code,
    msg: resData.msg,
    info: info
  });
};

const deductionRule_change_channel_to_cn = (resData, dispatch) => {


  let code = resData["code"];
  let msg = resData["msg"];
  let info = resData["data"]["info"];
  let channelArray = [];
  let userArray = [];
  let userId = info["userId"].toString().split(",");
  let channelId = info["channelId"].toString().split(",");

  if (!(info.fieldToBeOperate === 'newUserBindCount' || info.fieldToBeOperate === 'userBindCount')) {
    info["guarantee"] = Number(info["guarantee"]) / 100;
  }
  info["init"] = Number(info["init"]) * 100;
  info["step"] = Number(info["step"]) * 100;
  info["upperLimit"] = Number(info["upperLimit"]) * 100;

  channelId.map((id, i) => {
    let axiosUrl = `${
      setup().api["14"]["list"]
      }?page=1&limit=10&channelId=${id}`;
    useAxios(axiosUrl).then(res => {
      let resChannelData = res.data;
      let channelList = resChannelData.data.list;
      if (channelList.length > 0) {
        info["channelId"] = channelArray = [
          ...channelArray,
          {
            channelId: channelList[0]["id"],
            channelName: channelList[0]["channelName"]
          }
        ];
      } else {
        info["channelId"] = channelArray = [...channelArray];
      }

      userId.map((id, i) => {
        useAxios(`${setup().api["9"]["list"]}?userId=${id}`).then(res => {
          let resUserData = res.data;
          let userList = resUserData.data.list;
          info["userId"] = userArray = [
            ...userArray,
            { userlIds: userList[0]["id"], userNames: userList[0]["userName"] }
          ];
          dispatch({
            type: "ADMIN_INFO",
            code: code,
            msg: msg,
            info: info
          });
        });
      });
    });
  });
};

export function admin_get_user_pageColumns(match, status) {
  return function (dispatch) {
    let userId = match["params"]["id"];
    let axiosUrl = `${setup().api["9"]["menuList"]}?userId=${userId}&enabled=1`;

    useAxios(axiosUrl).then(res => {
      let resData = res.data;
      let list = resData.data.list;
      let code = resData.code;
      let msg = resData.msg;
      dispatch({
        type: "ADMIN_USER_MENULIST",
        data: list,
        code,
        msg
      });
    });
  };
}

const useAxios = apiUrl => {
  let token = setup().token;
  return axios
    .get(`${apiUrl}`, {
      headers: {
        Authorization: token
      }
    })
    .then(res => {
      return res;
    });
};
