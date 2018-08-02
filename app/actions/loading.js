export function loading(completeStatus) {
  return function(dispatch) {
    dispatch({
      type: "LOADING_COMPLETE",
      complete: completeStatus
    });
  };
}

export function loadingState(loadingState) {
  return function(dispatch) {
    dispatch({
      type: "LOADING_STATUS",
      state: loadingState
    });
  };
}

export function loadingForm(loadingState) {
  return function(dispatch) {
    dispatch({
      type: "LOADING_FORM",
      status: loadingState
    });
  };
}
