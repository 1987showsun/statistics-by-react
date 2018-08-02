export default function popup(
  state = {
    random      : 0,
    code        : -1,
    msg         : "",
    data        : [],
  },action){
  switch( action.type ){
    case 'SEARCH_SET':
      state = { ...state, random: Math.random(), code:action.code, msg:action.msg, data:action.data }
      break;
  }
  return state;
}
