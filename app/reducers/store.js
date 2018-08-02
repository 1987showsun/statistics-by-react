import { combineReducers } from "redux";

//import reducer
import login               from './login';
import nav                 from './nav';
import home                from './home';
import channelHistoryList  from './channelHistoryList';
import charts              from './charts';
import admin               from './admin';
import popup               from './popup';
import loading             from './loading';
import common              from './common';
import search              from './search';

export default combineReducers({
  login,
  nav,
  home,
  channelHistoryList,
  charts,
  admin,
  popup,
  loading,
  common,
  search
})
