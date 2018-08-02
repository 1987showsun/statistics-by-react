import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

export default class Children extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navData: props.navData,
      recordsPath: props.recordsPath
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      navData: nextProps.navData,
      recordsPath: nextProps.recordsPath
    });
  }

  recordsPath(path, name, id) {
    this.props.recordsPath(path, name, id);
  }

  render() {
    return (
      <NavLink
        to={this.props.url}
        onClick={this.recordsPath.bind(
          this,
          this.props.url,
          this.props.name,
          this.props.id
        )}
      >
        <span className={`icon ${this.props.iconClass}`} />
        {this.props.name}
      </NavLink>
    );
  }
}
