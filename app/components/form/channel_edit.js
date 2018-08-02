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

export default class ChannelEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      match          : props.match,
      msg            : props.popupMsg,
      formObject     : {
        id             : props.seleEditData['id'],
        channelName    : props.seleEditData['channelName'],
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      msg                   : nextProps.popupMsg
    })
  }

  handleChange(e){
    let formObject = this.state.formObject;
    let name       = e.target.name;
    let val        = e.target.value;
    formObject[name] = val;
    this.setState({
      formObject : formObject,
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
              <li className="label">渠道名称</li>
              <li>
                <div className="input-box">
                  <input type="text" name="channelName" value={this.state.formObject['channelName']} onChange={this.handleChange.bind(this)} required/>
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
