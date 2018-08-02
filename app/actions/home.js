import axios from "axios";
import { setup } from "./setup";

let token = setup().token;

export function home(searchFormObject) {
  return function(dispatch) {
    let params = ``;
    let axiosUrl = setup().api["1"]["list"];

    if (searchFormObject != undefined) {
      Object.keys(searchFormObject).map((key, i) => {
        if (i == 0) {
          params = `?${key}=${searchFormObject[key]}`;
        } else {
          params = `${params}&${key}=${searchFormObject[key]}`;
        }
      });
    }

    axios
      .get(`${axiosUrl}${params}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        let resData            = res['data'];
        let code               = resData['code'];
        let msg                = resData['msg'];
        let data               = resData['data'];
        let userStatisticsInfo = data['userStatisticsInfo'];
        let label              = ['新的用户绑定数','新的用户数'];
        let borderColor        = ['rgb(255, 99, 132)','rgb(24, 144, 255)'];
        let userStatisticsInfoKey = Object.keys(userStatisticsInfo);

        let returnKey = userStatisticsInfoKey.filter((key,i)=>{
          if( key!="categoryList" ){
            return key;
          }
        })
        
        let dataPoints   = {
          labels   : Object.assign([],userStatisticsInfo['categoryList']),
          datasets : []
        };

        returnKey.map((key,i)=>{
          dataPoints['datasets'] = [ ...dataPoints['datasets'] , {label:label[i] ,backgroundColor:'transparent' ,borderColor:borderColor[i] ,data:userStatisticsInfo[key] } ]
        })

        dispatch({
          type       : "HOME_SET",
          code       : code,
          msg        : msg,
          data       : data,
          dataPoints : dataPoints
        });
      });
  };
}
