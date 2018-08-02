export default function charts(
  state = {
    code                        : -1,
    msg                         : "",
    chargeTotalEveryHour        : {},
    onlineUser                  : {},
    chargeUserCountEveryHour    : {},
    registrationEveryHour       : {},
    allChannelList              : {},
  },action){
  switch( action.type ){
    case 'CHANGE_TOTAL_EVERY_HOUR':
      state = { ...state, chargeTotalEveryHour:action.data }
      break;

    case 'ONLINE_USER_SET':
      state = { ...state, onlineUser:action.data }
      break;

    case 'CHANGE_USER_COUNT_EVERY_HOUR':
      state = { ...state, chargeUserCountEveryHour:action.data }
      break;

    case 'REGISTRATION_EVERY_HOUR':
      state = { ...state, registrationEveryHour:action.data }
      break;

    case 'ALL_CHANNEL_LIST':
      state = { ...state, allChannelList:action.data }
      break;

    case 'CHARTS_AJAX_STATUS':
      state = { ...state, code:action.code, msg:action.msg }
      break;
  }
  return state;
}
