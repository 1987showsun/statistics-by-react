export default function home(
  state = {
    code: -1,
    msg: "",
    total: 0,
    newUserCount: 0,
    userBindCount: 0,
    userStatisticsInfo: [],
    chargeUserCount: 0,
    chargeSum: 0,
    pokerTaxScore: 0,
    newChargeUserCount: 0,
    newUserBindRate: 0,
    dataPoints: {}
  },
  action
) {
  switch (action.type) {
    case "HOME_SET":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        total: action.data.total,
        newUserCount: action.data.newUserCount,
        userBindCount: action.data.userBindCount,
        userStatisticsInfo: action.data.userStatisticsInfo,
        chargeUserCount: action.data.chargeUserCount,
        chargeSum: action.data.chargeSum,
        pokerTaxScore: action.data.pokerTaxScore,
        newChargeUserCount: action.data.newChargeUserCount,
        newUserBindRate: action.data.newUserBindRate,
        dataPoints     : action.dataPoints
      };
      break;
  }
  return state;
}
