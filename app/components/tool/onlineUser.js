import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import $ from "jquery";
import { message } from "antd";

//Jsons
import lang from "../../json/multi_language";

//Actions
import { onlineUser } from "../../actions/charts";

//Javascripts
import { getDate } from "../../public/javascripts/date";

@connect((state, props) => {
  return {
    navData: state.nav.navData
  };
})
export default class OnlineUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxDate: getDate().endDate,
      searchFormObject: {
        searchDate: getDate().endDate
      }
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  handleChange(e) {
    let searchFormObject = this.state.searchFormObject;
    let name = e.target.name;
    let val = e.target.value;

    searchFormObject[name] = val;

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = this.state.searchFormObject;
    this.props.dispatch(onlineUser(searchFormObject));
  }

  render() {
    return (
      <div className="tool">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <ul className="form-list">
            <li>
              <span className="label">
                {lang["zh-cn"]["form"]["label"]["searchTime"]}
              </span>
              <div className="input-box">
                <input
                  type="date"
                  name="searchDate"
                  value={this.state.searchFormObject["searchDate"]}
                  onChange={this.handleChange.bind(this)}
                  max={this.state.maxDate}
                />
              </div>
            </li>
            <li>
              <button type="submit" className="search-submit">
                {lang["zh-cn"]["form"]["btn"]["search"]}
              </button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
