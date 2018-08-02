export default function channelHistoryList(
  state = {
    code: -1,
    msg: "",
    channelNames: "",
    list: [],
    total: null,
    params: "",
    limit: null
  },
  action
) {
  switch (action.type) {
    case "CHANNEL_HISTORY_LIST_SET":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        channelNames: action.channelNames,
        list: action.list,
        total: action.total,
        params: action.params,
        limit: action.limit
      };
      break;
  }
  return state;
}
