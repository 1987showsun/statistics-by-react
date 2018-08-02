import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, NavLink } from "react-router-dom";
import $ from "jquery";

//Jsons

//Components

//Actions
import { sitmap } from "../../actions/nav";

@connect((state, props) => {
  return {
    random: state.nav.random,
    navData: state.nav.navData,
    recordsPath: state.nav.recordsPath
  };
})
export default class Sitmap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recordsPath: props.recordsPath
    };
  }

  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      recordsPath: nextProps.recordsPath
    });
  }

  removeSitmap(id) {
    let recordsPath = this.state.recordsPath;
    this.props.dispatch(sitmap("del", recordsPath, "", "", id));
  }

  render() {
    return (
      <div
        className={`sitmap ${
          this.state.recordsPath.length > 0 ? "show" : "hide"
        }`}
      >
        <div className="sitmap-block">
          {this.state.recordsPath.length > 0 && (
            <ul className="sitmap-list">
              {this.state.recordsPath.map((item, i) => {
                return (
                  <li key={i}>
                    <NavLink to={item.path}>{item.name}</NavLink>
                    <span
                      className="remove-sitmap"
                      onClick={this.removeSitmap.bind(this, item.id)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}
