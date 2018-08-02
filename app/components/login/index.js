import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Route, Link }                                from 'react-router-dom';
import $                                              from 'jquery';

//Components
import Signin                                         from './signIn';
//import Signadd                                        from './signAdd';

export default class Index extends React.Component{

  renderView(){

  }

  render(){
    const pagetype = this.props.match.params.pagetype;
    switch ( pagetype ) {
      case 'sign_add':
        break;

      default:
        return <Signin history={this.props.history}/>
        break;
    }
  }
}
