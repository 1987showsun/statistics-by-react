import React, { Component }                           from 'react';
import { connect }                                    from 'react-redux';
import { NavLink }                                    from 'react-router-dom';

export default class NoChildren extends React.Component{
  render(){
    return(
      <span>
        <span className={`icon ${this.props.iconClass}`}></span>
        {this.props.name}
      </span>
    );
  }
}
