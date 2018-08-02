import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import $ from "jquery";

//redux
import store from "./store";

//Compontents
import Layout from "./components/common/layout";

//Stylesheets
import "./public/stylesheets/style.scss";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <BrowserRouter>
        <HashRouter>
          <Provider store={store}>
            <Layout />
          </Provider>
        </HashRouter>
      </BrowserRouter>
    );
  }
}

const app = document.getElementById("app");
ReactDOM.render(<Index />, app);
