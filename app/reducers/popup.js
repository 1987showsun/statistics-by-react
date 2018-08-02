export default function popup(
  state = {
    random      : 0,
    status      : "hide",
    types       : "",
    msg         : "",
    title       : "",
    data        : [],
    match       : [],
    actions     : [],
  },action){
  switch( action.type ){
    case 'POPUP_SET':
      state = {
        ...state,
        status   : action.status,
        types    : action.types,
        msg      : action.msg,
        title    : action.title,
        data     : action.data,
        match    : action.match,
        actions  : action.actions,
        random   : Math.random(),
      }
      break;

    case 'POPUP_MSG' :
      state = { ...state, msg:action.msg, random:Math.random() }
      break;
  }
  return state;
}
