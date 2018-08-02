import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Route, Link }                                from 'react-router-dom';
import $                                              from 'jquery';

export default class Footer extends React.Component{
  render(){
    return(
      <footer id="footer">
        <small>footer</small>
      </footer>
    )
  }
}
