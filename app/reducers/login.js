export default function login(
  state = {
    code : sessionStorage.getItem('code') || -1,
    msg  : "",
    loginStatus : false,
    user : []
  },
  action
) {
  switch (action.type) {
    case "LOGIN_STATUS":
      state = {
        ...state,
        code        : action.code,
        msg         : action.msg,
        user        : action.data
      };
      break;

    case "LOGOUT_STATUS":
      state = {
        ...state,
        code        : action.code,
        loginStatus : action.loginStatus,
      };
      break;

    case "LOGIN_MEMBER":
      break;
  }
  return state;
}
