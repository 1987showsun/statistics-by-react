import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Route, Link }                                from 'react-router-dom';
import $                                              from 'jquery';

import { update }                                     from '../../actions/admin/update';

@connect((state,props)=>{
  return{
    popupMsg     : state.popup.msg,
    seleEditData : state.popup.data
  }
})

export default class BrandEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      match          : props.match,
      update_status  : 0,
      msg            : props.popupMsg,
      formObject     : {
        id               : props.seleEditData['id'],
        brandName        : props.seleEditData['brandName'],
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg                   : nextProps.popupMsg,
    })
  }

  handleChange(e){
    let update_status   = this.state.update_status;
    let formObject      = this.state.formObject;
    let name            = e.target.name;
    let val             = e.target.value;

    if( name=="update_status" ){
      update_status = val;
    }else{
      formObject[name] = val;
    }

    this.setState({
      update_status : update_status,
      formObject    : formObject,
    })
  }

  handleSubmit(e){
    e.preventDefault();
    let formObject = this.state.formObject;
    let match      = this.state.match;
    this.props.dispatch( update(match,formObject) );
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit.bind(this)}>
        <ul className={`admin-ul`}>
          <li>
            <ul>
              <li className="label">品牌名称</li>
              <li>
                <div className="input-box">
                  <input type="text" name="brandName" value={this.state.formObject['brandName']} onChange={this.handleChange.bind(this)} required/>
                </div>
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
