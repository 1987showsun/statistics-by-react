import axios from "axios";
import { setup } from "./setup";

export function signIn(formObject) {
  return function(dispatch) {
    let username = formObject["username"];
    let password = formObject["password"];
    let code     = formObject["code"];    
    let params   = `?username=${username}&password=${password}&code=${code}`;
    let axiosUrl = `${setup().api["login"]["sigin"]}${params}`;

    axios.post(`${axiosUrl}`).then(res => {
      let resData     = res.data;
      let token       = resData.data.token;
      let user        = resData.data.info;
      let code        = resData.code;
      let msg         = resData.msg;

      sessionStorage.setItem("code", code);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type     : "LOGIN_STATUS",
        msg      : msg,
        code     : code
      });
    });
  };
}

export function logout() {
  return function(dispatch) {
    sessionStorage.clear();
    localStorage.clear();
    dispatch({
      type: "LOGIN_STATUS",
      msg: "登出成功",
      code: -1
    });
  };
}

export function getMemberInfo(formObject) {
  return function(dispatch) {
    let member = setup().member;
    let auth = setup().auth;
    dispatch({
      type: "LOGIN_MEMBER",
      member: member,
      auth: auth
    });
  };
}
