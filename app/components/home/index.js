import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

@connect((state, props) => {
  return {};
})
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(sessionStorage.getItem("user"))
    };
  }

  render() {
    return (
      <main>
        <div className="home-content">
          <article className="home-content-center">
            <div style={{ width: "100%" }}>
              <h2>您好{this.state.user["userName"]}:</h2>
            </div>
            <div>
              <p>欢迎来到统计系统，现在就开始您的工作吧！！</p>
            </div>
          </article>
        </div>
      </main>
    );
  }
}
