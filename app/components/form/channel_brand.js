import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';

//Components
import CheckBox from "../input/checkBox";

//Actions
import { setup }                                      from "../../actions/setup";
import { update_channel_brand }                       from '../../actions/admin/update';

@connect((state, props) => {
  return {
    popupMsg: state.popup.msg,
    seleEditData: state.popup.data,
    allRoleList: state.admin.roleList
  };
})
export default class UserEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectOpenStatus  : "hide",
      match             : props.match,
      msg               : props.popupMsg,
      allRoleList       : props.allRoleList,
      checkBoxSetup     : {
        wantUseApi            : "searchBrand",    //想使用的 Api,
        useApiUrl             : setup().api['makeUp']['searchBrand'],
        multiple              : false,            //複選 true:開啟 false:關閉
        showSearchBox         : true,             //搜尋輸入框 true:顯示 false:隱藏
        inputName             : "brandName",      //搜尋輸入框  inputName
        selectedData          : []
      },
      formObject: {
        channelId: props.seleEditData["id"],
        brandId  : []
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg: nextProps.popupMsg,
      allRoleList: nextProps.allRoleList
    });
  }

  checkBoxBackArray(array){
    let formObject = Object.assign({},this.state.formObject);
     formObject['brandId']   = array.map((item,i)=>{return item['checkBoxId'] }).toString();

     this.setState({
       formObject :  formObject
     });
  }

  handleChange(e) {
    let formObject = this.state.formObject;
    let name = e.target.name;
    let val = e.target.value;
    formObject[name] = val;
    this.setState({
      formObject: formObject
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let formObject = Object.assign({}, this.state.formObject);
    let match = this.state.match;
    this.props.dispatch(update_channel_brand(match, formObject));
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">请选取品牌</li>
              <li>
                <CheckBox
                  checkBoxSetup     = {this.state.checkBoxSetup}
                  searchFormObject  = {this.state.formObject}
                  checkBoxBackArray = {this.checkBoxBackArray.bind(this)}
                  useApiUrl         = { this.state.checkBoxSetup['useApiUrl'] }
                />
              </li>
            </ul>
          </li>
          <li className="msg">{this.state.msg}</li>
          <li>
            <button type="submit">修改</button>
          </li>
        </ul>
      </form>
    );
  }
}
