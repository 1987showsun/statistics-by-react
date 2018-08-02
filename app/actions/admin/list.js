import axios from "axios";
import { setup } from "../setup";
import { loading } from "../loading";
import { changeDate, changeMs } from "../../public/javascripts/date";
import { popupAction } from "../popup";
import { message } from "antd";
import { loadingForm } from "../loading";

export function admin_list(match, limit, searchFormObject) {
  return function(dispatch) {
    let devStatus = setup().devStatus;
    let page = match.params.page;
    let nowPageNumber = match.params.nowPageNumber || 1;
    let axiosUrl = "";
    let combinationUrl = {};
    let reloadaxiosUrl = setup().api[page]["list"];

    //有搜尋條件時
    if (searchFormObject != undefined) {
      if (
        searchFormObject["searchType"] != "" &&
        searchFormObject["searchType"] != undefined
      ) {
        if (typeof searchFormObject["searchVal"] != "object") {
          combinationUrl[searchFormObject["searchType"]] =
            searchFormObject["searchVal"];
        } else {
          Object.keys(searchFormObject["searchVal"]).map(key => {
            combinationUrl = {
              ...combinationUrl,
              ...changeMs(searchFormObject["searchVal"][key])
            };
          });
        }
      } else if (searchFormObject["searchType"] === "") {
        combinationUrl = {};
      } else {
        combinationUrl = searchFormObject;
      }
    }
    dispatch({
      type: "KEEP_SEARCH_OBJECT",
      combinationUrl,
      matchPage: page
    });
    return reloadList(match, reloadaxiosUrl, combinationUrl)(dispatch);
  };
}

export function admin_search(match, limit, searchFormObject) {
  return function(dispatch) {
    let devStatus = setup().devStatus;
    let page = match.params.page;
    let nowPageNumber = match.params.nowPageNumber || 1;
    let axiosUrl = "";
    let combinationUrl = {};
    let reloadaxiosUrl = setup().api[page]["list"];

    //有搜尋條件時
    if (searchFormObject != undefined) {
      if (searchFormObject["searchType"] != "") {
        if (typeof searchFormObject["searchVal"] != "object") {
          combinationUrl[searchFormObject["searchType"]] =
            searchFormObject["searchVal"];
        } else {
          Object.keys(searchFormObject["searchVal"]).map(key => {
            combinationUrl = {
              ...combinationUrl,
              ...changeMs(searchFormObject["searchVal"][key])
            };
          });
        }
      }
    }
    return reloadList(match, reloadaxiosUrl, combinationUrl)(dispatch);
  };
}

export function admin_add(match, limit, formObject) {
  return function(dispatch) {
    let token = setup().token;
    let page = match.params.page;
    let axiosUrl = setup().api[page]["add"];
    let reloadaxiosUrl = setup().api[page]["list"];
    let popupSetup = {
      status: "hide",
      types: "",
      data: [],
      title: "",
      msg: "",
      actions: []
    };

    loadingForm(true)(dispatch);
    returnAxios("post", axiosUrl, formObject).then(res => {
      let resData = res.data;
      let code = resData.code;
      loadingForm(false)(dispatch);
      if (code == 0) {
        message.success("新增成功");
        popupAction(popupSetup)(dispatch);
        reloadList(match, reloadaxiosUrl)(dispatch);
      } else {
        dispatch({
          type: "POPUP_MSG",
          msg: resData.msg
        });
      }
    });
  };
}

export function reloadList(match, reloadaxiosUrl, wantCombinationParams) {
  let nowPageNumber = match.params.nowPageNumber || 1;
  let limit = 10;
  if (match["url"].indexOf("/admin/15/info") == 0) {
    limit = 1;
  }
  let params = {
    ...(wantCombinationParams || {}),
    page: nowPageNumber,
    limit: limit
  };
  return function(dispatch) {
    loading(false)(dispatch);

    return returnAxios("get", reloadaxiosUrl, params).then(res => {
      let resData = res.data;
      switch (match.params.page) {
        case "9":
          user(resData, dispatch);
          break;

        case "10":
          role(resData, dispatch);
          break;

        case "11":
          menu(resData, dispatch);
          break;

        case "12":
          pageColumn(resData, dispatch);
          break;

        case "13":
          brand(resData, dispatch);
          break;

        case "14":
          channel(resData, dispatch);
          break;

        case "15":
          deductionRule(resData, dispatch);
          break;

        case "16":
          operationLog(resData, dispatch);
          break;

        default:
      }
    });
  };
}

const user = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg; //
  let total = resData.data.total; //全部筆數
  let limit = resData.data.limit; //單頁最大筆數
  let list = resData.data.list;
  let accountTypeList = resData.data.accountTypeList;
  let enabledList = resData.data.enabledList;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      let changeEnabledListStatus = item.enabled == true ? 1 : 0;
      enabledList.map((enabledListItem, e) => {
        if (changeEnabledListStatus == enabledListItem.value) {
          item["enabled"] = enabledListItem.desc;
        }
      });
      accountTypeList.map((accountTypeListItem, a) => {
        if (item.accountType == accountTypeListItem.value) {
          item["accountType"] = accountTypeListItem.desc;
        }
      });

      localStorage.setItem(
        "accountTypeList",
        JSON.stringify(resData.data.accountTypeList)
      );

      item.createTimestamp = changeDate(item.createTimestamp);
      item.modifiedTimestamp = changeDate(item.modifiedTimestamp);
    });
  }

  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_USER_LIST",
    code: code,
    msg: msg,
    limit: limit,
    total: total,
    accountTypeList: accountTypeList,
    enabledList: enabledList,
    data: list
  });
};

const role = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg;
  let currentPage = resData.data.currentPage;
  let total = resData.data.total;
  let limit = resData.data.limit;
  let list = resData.data.list;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      item["createTimestamp"] = changeDate(item["createTimestamp"]);
      item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
    });
  }
  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_ROLE_LIST",
    code: code,
    msg: msg,
    currentPage: currentPage,
    total: total,
    limit: limit,
    data: list
  });
};

const menu = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg;
  let currentPage = resData.data.currentPage;
  let total = resData.data.total;
  let limit = resData.data.limit;
  let enabledList = resData.data.enabledList;
  let levelList = resData.data.levelList;
  let list = resData.data.list;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      item["createTimestamp"] = changeDate(item["createTimestamp"]);
      item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
      item["enabled"] = item["enabled"] == true ? "启用" : "停用";

      levelList.map((levelListItem, l) => {
        if (levelListItem.value == item["level"]) {
          item["level"] = levelListItem.desc;
        }
      });
    });
  }

  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_MENU_LIST",
    code: code,
    msg: msg,
    currentPage: currentPage,
    total: total,
    limit: limit,
    enabledList: enabledList,
    levelList: levelList,
    data: list
  });
};

const pageColumn = (resData, dispatch) => {
  let axiosMenuApiUrl = `${setup().api["11"]["list"]}`;
  let params = { level: 1 };

  returnAxios("get", axiosMenuApiUrl, params).then(res => {
    let code = resData.code;
    let msg = resData.msg;
    let currentPage = resData.data.currentPage;
    let total = resData.data.total;
    let limit = resData.data.limit;
    let list = resData.data.list;
    let menuList = res.data.data.list;
    if (list && list.length >= 0) {
      list.map(item => {
        item["createTimestamp"] = changeDate(item["createTimestamp"]);
        item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
        if (menuList && menuList.length >= 0) {
          menuList.map(menuItem => {
            if (item["menuId"] == menuItem["id"]) {
              item["menuId"] = menuItem["menuName"];
            }
          });
        }
      });
    }
    loading(true)(dispatch);
    dispatch({
      type: "ADMIN_PAGECOLUMN_LIST",
      code: code,
      msg: msg,
      currentPage: currentPage,
      total: total,
      limit: limit,
      data: list,
      menuList: menuList
    });
  });
};

const brand = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg;
  let currentPage = resData.data.currentPage;
  let total = resData.data.total;
  let limit = resData.data.limit;
  let list = resData.data.list;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      item["createTimestamp"] = changeDate(item["createTimestamp"]);
      item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
    });
  }
  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_BRAND_LIST",
    code: code,
    msg: msg,
    currentPage: currentPage,
    total: total,
    limit: limit,
    data: list
  });
};

const channel = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg;
  let currentPage = resData.data.currentPage;
  let total = resData.data.total;
  let limit = resData.data.limit;
  let list = resData.data.list;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      item["createTimestamp"] = changeDate(item["createTimestamp"]);
      item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
    });
  }

  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_CHANNEL_LIST",
    code: code,
    msg: msg,
    currentPage: currentPage,
    total: total,
    limit: limit,
    data: list
  });
};

const deductionRule = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg;
  let currentPage = resData.data.currentPage;
  let total = resData.data.total;
  let limit = resData.data.limit;
  let fieldToBeOperateList = resData.data.fieldToBeOperateList;
  let deductionRuleTypeList = resData.data.deductionRuleTypeList;
  let list = resData.data.list;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      item["beginTimestamp"] = changeDate(item["beginTimestamp"]);
      item["endTimestamp"] = changeDate(item["endTimestamp"]);
      item["createTimestamp"] = changeDate(item["createTimestamp"]);
      item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);

      fieldToBeOperateList.map((ftbol, a) => {
        if (ftbol.value == item["fieldToBeOperate"]) {
          item["fieldToBeOperate"] = ftbol.desc;
        }
      });

      deductionRuleTypeList.map((drtl, k) => {
        if (drtl.value == item["deductionRuleType"]) {
          item["deductionRuleType"] = drtl.desc;
        }
      });
    });
  }
  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_DEDUCTION_RULE_LIST",
    code: code,
    msg: msg,
    currentPage: currentPage,
    total: total,
    limit: limit,
    fieldToBeOperateList: fieldToBeOperateList,
    deductionRuleTypeList: deductionRuleTypeList,
    data: list
  });
};

const operationLog = (resData, dispatch) => {
  let code = resData.code;
  let msg = resData.msg;
  let currentPage = resData.data.currentPage;
  let total = resData.data.total;
  let limit = resData.data.limit;
  let requestMethodList = resData.data.requestMethodList;
  let operateTypeList = resData.data.operateTypeList;
  let list = resData.data.list;
  if (list && list.length >= 0) {
    list.map((item, i) => {
      operateTypeList.map(typeItem => {
        if (item["operateType"] == typeItem["value"]) {
          item["operateType"] = typeItem["desc"];
        }
      });
      requestMethodList.map(methodItem => {
        if (item["requestMethod"] == methodItem["value"]) {
          item["requestMethod"] = methodItem["desc"];
        }
      });
      item["createTimestamp"] = changeDate(item["createTimestamp"]);
      item["modifiedTimestamp"] = changeDate(item["modifiedTimestamp"]);
    });
  }
  loading(true)(dispatch);
  dispatch({
    type: "ADMIN_OPERATIONLOG_LIST",
    code: code,
    msg: msg,
    currentPage: currentPage,
    total: total,
    limit: limit,
    requestMethodList: requestMethodList,
    operateTypeList: operateTypeList,
    data: list
  });
};

export function open_popup(match, limit, formObject) {
  return function(dispatch) {
    popupSetup["types"] = "json";
    popupSetup["title"] = "请求参数";
    popupSetup["match"] = match;
    popupSetup["actions"] = ["success"];
    popupAction(popupSetup)(dispatch);
  };
}

const returnAxios = (method, axiosUrl, formObject) => {
  let token = setup().token;
  return axios({
    method: method,
    url: axiosUrl,
    headers: {
      Authorization: token
    },
    params: { ...formObject } // 会将参数拼接到url中
  }).then(res => {
    return res;
  });
};
