import axios from "axios";
import { admin_info } from "./info";
import { setup } from "../setup";
import { loading } from "../loading";
import { changeDate } from "../../public/javascripts/date";
import { popupAction } from "../popup";
import { message } from "antd";

let devStatus = setup().devStatus;
let token = setup().token;

export function admin_remove(match, popupSetup) {
  return function(dispatch) {
    let removeType = popupSetup["actions"]["1"] || "";
    let params = ``;
    let axiosUrl = "";
    let combination = "";
    let reloadCombination = "";
    let page = match.params.page;
    let id = match.params.id;
    let token = setup().token;
    switch (removeType) {
      case "makeUp":
        if (popupSetup["data"].hasOwnProperty("userId")) {
          params = `?userChannelMapId=${
            popupSetup["data"]["userChannelMapId"]
          }`;
          axiosUrl = `${setup().api[page]["removeSettingUser"]}`;
        } else {
          params = `?brandChannelMapId=${
            popupSetup["data"]["brandChannelMapId"]
          }`;
          axiosUrl = `${setup().api[page]["removeSettingBrand"]}`;
        }
        break;

      default:
        params = `?id=${id}`;
        axiosUrl = `${setup().api[page]["remove"]}`;
    }

    axios
      .post(
        `${axiosUrl}${params}`,
        {},
        {
          headers: {
            authorization: token
          }
        }
      )
      .then(res => {
        let resData = res.data;
        let code = resData.code;
        let msg = resData.msg;
        if (code == 0) {
          popupSetup["status"] = "hide";
          popupAction(popupSetup)(dispatch);
          //admin_info(match)(dispatch);
          if (removeType != "makeUp") {
            history.go(-1);
            message.success("刪除完成");
          }
        }
      });
    // .then(res => {
    //   let resData = res.data;
    //   let code = resData.code;
    //   let msg = resData.msg;
    //   if (code == 0) {
    //     popupSetup["types"] = "note";
    //     popupSetup["title"] = "修改完成";
    //     popupSetup["match"] = match;
    //     popupSetup["actions"] = ["success", ""];
    //     popupAction(popupSetup)(dispatch);
    //     admin_info(match)(dispatch);
    //     if (removeType != "makeUp") {
    //       history.go(-1);
    //     }
    //   } else {
    //     dispatch({
    //       type: "POPUP_MSG",
    //       msg: resData.msg
    //     });
    //   }
    // });
  };
}
