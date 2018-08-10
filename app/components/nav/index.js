import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import $ from "jquery";

//Components
import Children from "../nav/children";
import NoChildren from "../nav/noChildren";

//actions
import { nav, sitmap } from "../../actions/nav";
import { header } from "../../actions/common";

@connect((state, props) => {
  return {
    random: state.nav.random,
    navData: state.nav.navData,
    recordsPath: state.nav.recordsPath,
    navStatus: state.common.navStatus
  };
})
export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navData: props.navData,
      recordsPath: props.recordsPath,
      navStatus: props.navStatus,
      clicked: false
    };
  }

  componentDidMount() {
    this.props.dispatch(nav());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      navData: nextProps.navData,
      recordsPath: nextProps.recordsPath,
      navStatus: nextProps.navStatus
    });
  }

  navSwitch() {
    let navStatus = this.state.navStatus;
    if (navStatus == "show") {
      navStatus = "hide";
    } else {
      navStatus = "show";
    }
    this.props.navSwitch(navStatus);
    this.props.dispatch(header(navStatus));
  }

  recordsPath(path, name, id) {
    let recordsPath = this.state.recordsPath;
    this.props.dispatch(sitmap("add", recordsPath, path, name, id));
  }

  navlevel1(item) {
    if (item.enabled == true) {
      let type = item.path.split("/")[1];
      if (item.children.length == 0) {
        return (
          <Children
            id={item.id}
            name={item.menuName}
            url={`/${type}/${item.id}`}
            iconClass={item.iconClass}
            recordsPath={this.recordsPath.bind(this)}
            key={item.id}
          />
        );
      } else {
        let enabledIsEqualToTrue = item.children.filter(status => {
          return status.enabled == true;
        });
        if (enabledIsEqualToTrue && enabledIsEqualToTrue.length > 0) {
          return <NoChildren name={item.menuName} iconClass={item.iconClass} />;
        } else {
          return (
            <Children
              id={item.id}
              name={item.menuName}
              url={`/${type}/${item.id}`}
              iconClass={item.iconClass}
              recordsPath={this.recordsPath.bind(this)}
              key={item.id}
            />
          );
        }
      }
    }
  }

  navlevel2(item) {
    if (item.children.length > 0) {
      return (
        <ul className="nav-sub">
          {item.children.map((level2, i) => {
            let type = level2.path.split("/")[1];
            if (level2.enabled == true) {
              if (level2.children.length == 0) {
                return (
                  <Children
                    key={i}
                    id={level2.id}
                    name={level2.menuName}
                    url={`/${type}/${level2.id}`}
                    iconClass={level2.iconClass}
                    recordsPath={this.recordsPath.bind(this)}
                  />
                );
              } else {
              }
            }
          })}
        </ul>
      );
    }
  }

  navlevel3(item) {}

  menuClick(item, i) {
    event.stopPropagation();
    if (item && item.id === 8 && item.level === 1) {
      this.setState({
        clicked: !this.state.clicked
      });
    }
  }

  render() {
    return (
      <nav className={`${this.state.navStatus}`}>
        <div className="nav-block">
          <ul className={this.state.clicked ? "nav-main clicked" : "nav-main"}>
            {this.state.navData.map((item, i) => {
              return (
                <li key={i}>
                  <span onClick={e => this.menuClick(item, i)}>
                    {this.navlevel1(item)}
                  </span>
                  {this.navlevel2(item)}
                </li>
              );
            })}
          </ul>
        </div>
        <div class="navNull" onClick={this.navSwitch.bind(this)} />
      </nav>
    );
  }
}
