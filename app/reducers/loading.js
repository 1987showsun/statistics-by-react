export default function loading(
  state = {
    complete: false,
    state: false,
    formLoading: false
  },
  action
) {
  switch (action.type) {
    case "LOADING_COMPLETE":
      state = {
        ...state,
        //complete  : action.complete,
        complete: true
      };
      break;
    case "LOADING_STATUS":
      state = { ...state, state: action.state };
      break;

    case "LOADING_FORM":
      state = { ...state, formLoading: action.status };
      break;
  }
  return state;
}
