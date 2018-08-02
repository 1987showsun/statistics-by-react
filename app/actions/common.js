export function header(navStatus){
  return function(dispatch){
    dispatch({
      type      : "HEADER_STATUS",
      navStatus : navStatus
    })
  }
}
