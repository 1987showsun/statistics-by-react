import React, { Component } from "react";
import { Redirect, Route, Link, Switch } from "react-router-dom";

//Components

import Login from "../login";
import Signin from "../login/signIn";
import Home from "../home";
import Form from "../form";
import Info from "../admin/admin_info";
import LoadingPage from "../../components/module/loadingPage";

import Nav from "../nav";
import Header from "./header";
import SelectRender from "./selectRender";
import Popup from "../module/popup";

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navStatus  : "hide",
      code       : -1
    };
  }

  navSwitch(navStatus) {
    this.setState({
      navStatus: navStatus
    });
  }

  logout( code ){
  }

  render() {
    const code = sessionStorage.getItem("code") || -1;
    if (code != -1) {
      return (
        <div id="wrapper" className={`${this.state.navStatus}`}>
          <Route
            render={() => <Header navSwitch={this.navSwitch.bind(this)} match={this.state.match} logoutCallback={this.logout.bind(this)}/>}
          />
          <Route render={() => <Nav navSwitch={this.navSwitch.bind(this)} />} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:type/:page" component={SelectRender} />
            <Route
              exact
              path="/:type/:page/:nowPageNumber"
              component={SelectRender}
            />
            <Route exact path="/:type/:page/info/:id" component={Info} />
            <Route exact path="/:type/:page/form/:action" component={Form} />
            <Route
              exact
              path="/:type/:page/form/:action/:id"
              component={Form}
            />
          </Switch>
          <Route component={LoadingPage} />
          <Route component={Popup} />
        </div>
      );
    } else {
      return (
        <div id="login">
          <Switch>
            <Route exact path="/:pagetype" component={Login} />
            <Route exact path="/" render={() => 
              <Redirect to="/sign_in" component={Signin} />
            }/>
            <Route
              exact
              path="*"
              render={() => <Redirect to="/sign_in" component={Signin} />}
            />
          </Switch>
        </div>
      );
    }
  }
}
