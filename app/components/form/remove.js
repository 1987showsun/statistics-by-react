import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";

//Actions
import { admin_remove } from "../../actions/admin/remove";

@connect((state, props) => {
  return {};
})
export default class Remove extends React.Component {
  componentDidMount() {
    this.props.dispatch(admin_remove());
  }

  render() {
    return null;
  }
}
