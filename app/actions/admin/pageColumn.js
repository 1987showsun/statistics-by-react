import axios from "axios";
import { setup } from "../setup";
import { loading } from "../loading";
import { changeDate } from "../../public/javascripts/date";

let apiUrl = setup().apiUrl;
let token = setup().token;

export function admin_pageColumn_search(match, limit, searchFormObject) {
  return function(dispatch) {
    let nowPageNumber = match.params.nowPageNumber || 1;
    let axiosUrl = "";
    let axiosMenuApiUrl = "";

    let searchVal = searchFormObject["searchVal"];
    axiosMenuApiUrl = `${apiUrl}admin/menu/listByLevel`;
    if (searchFormObject["searchType"] == "menuId") {
      axiosUrl = `${apiUrl}admin/pageColumn/getPageColumnListByMenuId?menuId=${searchVal}`;
    }

    dispatch({
      type: "CLEAN_ADMIN_PAGECOLUMN_LIST"
    });

    loading(false)(dispatch);
    return axios
      .get(`${axiosMenuApiUrl}`, {
        headers: {
          Authorization: token
        },
        params: {
          level: 1
        }
      })
      .then(res => {
        let resData = res.data;
        let menuList = resData.data.list;

        return axios
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
              list.map(item => {
                item["createTimestamp"] = changeDate(item["createTimestamp"]);
                item["modifiedTimestamp"] = changeDate(
                  item["modifiedTimestamp"]
                );

                menuList.map(menuItem => {
                  if (item["menuId"] == menuItem["id"]) {
                    item["menuId"] = menuItem["menuName"];
                  }
                });
              });
            }

            loading(true)(dispatch);
            dispatch({
              type: "ADMIN_PAGECOLUMN_LIST",
              code: code,
              msg: msg,
              currentPage: nowPageNumber,
              total: 0,
              limit: 10,
              data: list,
              menuList: menuList
            });
          });
      });
  };
}

export function clean_admin_pageColumn_list() {
  return function(dispatch) {
    dispatch({
      type: "CLEAN_ADMIN_PAGECOLUMN_LIST"
    });
  };
}
