export default function nav(
  state = {
    random      : 0,
    navData     : [],
    recordsPath : JSON.parse(sessionStorage.getItem('recordsPath')) || [],
  },action){
  switch( action.type ){
    case 'NAV_SET':
      state = { ...state, navData:action.navData }
      break;

    case 'RECORDS_PATH':
      state = { ...state, recordsPath:action.recordsPath, random:Math.random() }
      break;
  }
  return state;
}
