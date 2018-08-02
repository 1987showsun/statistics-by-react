export default function admin(
  state = {
    random: 0,
    code: -1,
    msg: "",
    limit: 10,
    total: 0,
    currentPage: 1,
    accountTypeList: [],
    enabledList: [],
    levelList: [],
    fieldToBeOperateList: [],
    deductionRuleTypeList: [],
    requestMethodList: [],
    operateTypeList: [],
    userList: [],
    userInfo: [],
    roleList: [],
    roleInfo: [],
    deductionRuleList: [],
    menuList: [],
    pageColumnList: [],
    brandList: [],
    channelList: [],
    operationLogList: [],
    info: {},
    combinationUrl: {
      searchType: "",
      searchVal: ""
    }
  },
  action
) {
  switch (action.type) {
    case "ADMIN_USER_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        accountTypeList: action.accountTypeList,
        enabledList: action.enabledList,
        userList: action.data,
        random: Math.random()
      };
      break;

    case "ADMIN_ROLE_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        currentPage: action.currentPage,
        roleList: action.data
      };
      break;

    case "ADMIN_DEDUCTION_RULE_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        fieldToBeOperateList: action.fieldToBeOperateList,
        deductionRuleTypeList: action.deductionRuleTypeList,
        deductionRuleList: action.data
      };
      break;

    case "ADMIN_MENU_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        enabledList: action.enabledList,
        levelList: action.levelList,
        menuList: action.data
      };
      break;

    case "ADMIN_PAGECOLUMN_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        currentPage: action.currentPage,
        pageColumnList: action.data,
        menuList: action.menuList
      };
      break;

    case "ADMIN_BRAND_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        currentPage: action.currentPage,
        brandList: action.data
      };
      break;

    case "ADMIN_CHANNEL_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        currentPage: action.currentPage,
        channelList: action.data
      };
      break;

    case "ADMIN_OPERATIONLOG_LIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        limit: action.limit,
        total: action.total,
        currentPage: action.currentPage,
        requestMethodList: action.requestMethodList,
        operateTypeList: action.operateTypeList,
        operationLogList: action.data
      };
      break;

    case "ADMIN_INFO":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        info: action.info
      };
      break;

    case "ADMIN_REMOVE":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        random: Math.random()
      };
      break;

    case "ADMIN_ROLE_LIST_ALL":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        roleList: action.data
      };
      break;

    case "ADMIN_API_STATUS":
      state = { ...state, code: action.code, msg: action.msg };
      break;

    case "ADMIN_USER_MENULIST":
      state = {
        ...state,
        code: action.code,
        msg: action.msg,
        userMenulist: action.data
      };
      break;

    case "CLEAN_ADMIN_PAGECOLUMN_LIST":
      state = {
        ...state,
        pageColumnList: []
      };
      break;

    case "KEEP_SEARCH_OBJECT":
      state = {
        ...state,
        combinationUrl: action.combinationUrl,
        matchPage: action.matchPage
      };
      break;
  }
  return state;
}
