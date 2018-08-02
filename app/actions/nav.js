import axios from "axios";
import { setup } from "./setup";

let devStatus = setup().devStatus;
let token = setup().token;

export function nav() {
  let token = `Bearer ${sessionStorage.getItem("token")}`;

  return function(dispatch) {
    let params = ``;
    let axiosUrl = `${setup().api["menuList"]["list"]}${params}`;

    axios
      .get(`${axiosUrl}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData = res.data;
        let navData = resData.data.list;

        dispatch({
          type: "NAV_SET",
          navData: navData
        });
      });
  };
}

export function sitmap(type, recordsPath, path, name, id) {
  return function(dispatch) {
    let checkAddRecordsPath = true;
    let selectRemoveItem = 0;

    switch (type) {
      case "add":
        recordsPath.map((item, i) => {
          if (item.id == id) {
            checkAddRecordsPath = false;
          }
        });

        if (checkAddRecordsPath) {
          recordsPath.push({ id: id, name: name, path: path });
        }
        break;

      default:
        recordsPath.map((item, i) => {
          if (item.id == id) {
            selectRemoveItem = i;
          }
        });

        recordsPath.splice(selectRemoveItem, 1);
    }

    sessionStorage.setItem("recordsPath", JSON.stringify(recordsPath));
    dispatch({
      type: "RECORDS_PATH",
      recordsPath: recordsPath
    });
  };
}
