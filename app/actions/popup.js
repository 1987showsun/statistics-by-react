
export function popupAction(popupSetup){
  return function(dispatch){
    dispatch({
      type     : "POPUP_SET",
      status   : popupSetup.status,
      types    : popupSetup.types,
      msg      : popupSetup.msg,
      title    : popupSetup.title,
      data     : popupSetup.data,
      match    : popupSetup.match,
      actions  : popupSetup.actions
    })
  }
}
