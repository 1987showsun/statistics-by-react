import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Jsons

//Components
import User from "./admin_user";
import Role from "./admin_role";
import Menu from "./admin_menu";
import PageColumns from "./admin_pageColumns";
import Brand from "./admin_brand";
import Channel from "./admin_channel";
import DeductionRule from "./admin_deductionRule";
import OperationLog from "./admin_operationLog";
import UserIpConfig from "./admin_userIpConfig";
//Actions

@connect((state, props) => {
  return {
    navData: state.nav.navData
  };
})
export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      navData: props.navData
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      match: nextProps.match,
      navData: nextProps.navData
    });
  }

  selectRenderView() {
    const page = this.state.match.params.page;
    let pageComponent = "";

    this.state.navData.map((item, i) => {
      if (item.id == 8) {
        const children = item.children;
        children.map((childrenItem, c) => {
          if (childrenItem.id == page) {
            pageComponent = childrenItem.path.split("/")[2].replace("**", "");
          }
        });
      }
    });

    switch (pageComponent) {
      case "user":
        return <User match={this.props.match} history={this.props.history} />;
        break;

      case "role":
        return <Role match={this.props.match} history={this.props.history} />;
        break;

      case "menu":
        return <Menu match={this.props.match} history={this.props.history} />;
        break;

      case "pageColumn":
        return (
          <PageColumns match={this.props.match} history={this.props.history} />
        );
        break;

      case "brand":
        return <Brand match={this.props.match} history={this.props.history} />;
        break;

      case "channel":
        return (
          <Channel match={this.props.match} history={this.props.history} />
        );
        break;

      case "deductionRule":
        return (
          <DeductionRule
            match={this.props.match}
            history={this.props.history}
          />
        );
        break;

      case "operationLog":
        return (
          <OperationLog match={this.props.match} history={this.props.history} />
        );
        break;

      case "userIpConfig":
        return (
          <UserIpConfig match={this.props.match} history={this.props.history} />
        );
        break;

      default:
    }
  }

  resetTitle() {
    let page = this.state.match.params.page;
    let adminNav = this.state.navData.filter(item => {
      return item.id == 8;
    });
    if (adminNav.length > 0) {
      let filterObject = adminNav[0]["children"].filter(item => {
        return item.id == page;
      });
      return filterObject[0]["menuName"];
    }
  }

  render() {
    return (
      <section className="content">
        <section className="block-title">
          <h3>{this.resetTitle()}</h3>
        </section>
        {this.selectRenderView()}
      </section>
    );
  }
}
