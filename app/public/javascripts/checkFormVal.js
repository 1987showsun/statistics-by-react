//lang
import lang from '../../json/multi_language.json';

export function checkFrom(type,val,required){

  let status = true;
  let msg    = "";

  switch (type) {
    case 'number':

      let number_parse = /^[0-9]+$/;
      if (!number_parse.test(val)) {
        msg    = lang['zh-cn']['note']['nonumber'];
        status = false;
      }
      break;

    case 'date' :
      let date_parse = new RegExp("^([0-9]{4})[.-]{1}([0-9]{1,2})[.-]{1}([0-9]{1,2})$");
      let strDataValue;
      let status = true;
      if ((strDataValue = date_parse.exec(str)) != null) {
        var i;
        i = parseFloat(strDataValue[1]);
        if (i <= 0 || i > 9999) { /*年*/
          status = false;
        }
        i = parseFloat(strDataValue[2]);
        if (i <= 0 || i > 12) { /*月*/
          status = false;
        }
        i = parseFloat(strDataValue[3]);
        if (i <= 0 || i > 31) { /*日*/
          status = false;
        }
      } else {
        status = false;
      }
      if(!status){
        msg    = lang['zh-cn']['note']['nodate'];
      }
      break;

    case 'mail':
      let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
      if( strEmail.search(val)==-1 ){
        status = false;
        msg    = lang['zh-cn']['note']['nomail'];
      }
      break;

    default:

  }

  if( required==true ){
    if( val=="" ){
      status = false;
      msg    = lang['zh-cn']['note']['required'];
    }
  }

  return {
    status : status,
    msg    : msg,
  }
}
