export default function common(
  state = {
    navStatus : "hide"
  },action){
  switch( action.type ){
    case 'HEADER_STATUS':
      state = { ...state, navStatus: action.navStatus }
      break;
  }
  return state;
}
