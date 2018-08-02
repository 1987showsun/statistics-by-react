import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import $ from "jquery";

//Jsons
import lang from "../../json/multi_language";

//javascripts
import { checkFrom } from "../../public/javascripts/checkFormVal";

//Actions
import { admin_list } from "../../actions/admin/list";

@connect((state, props) => {
  return {
    limit: state.admin.limit,
    fieldToBeOperateList: state.admin.fieldToBeOperateList,
    deductionRuleTypeList: state.admin.deductionRuleTypeList
  };
})
export default class Searchbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: props.limit,
      match: props.match,
      nowPageNumber: props.match.params.nowPageNumber || 1,
      fieldToBeOperateList: props.fieldToBeOperateList,
      deductionRuleTypeList: props.deductionRuleTypeList,
      searchFormObject: {
        searchType: "",
        searchVal: ""
      },
      searchCheckFrom: ""
    };
  }

  handleChange(e, main) {
    let searchFormObject = this.state.searchFormObject;
    let name = e.target.name;
    let val = e.target.value;
    if (name === "searchType") {
      this.setState({
        searchCheckFrom: e.target.options[e.target.selectedIndex].getAttribute(
          "type"
        )
      });
    }
    searchFormObject[name] = val;
    if (main) searchFormObject.searchVal = "";

    this.setState({
      searchFormObject: searchFormObject
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      limit: nextProps.limit,
      nowPageNumber: nextProps.match.params.nowPageNumber || 1,
      fieldToBeOperateList: nextProps.fieldToBeOperateList,
      deductionRuleTypeList: nextProps.deductionRuleTypeList
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let searchFormObject = {
      ...this.state.searchFormObject,
      searchVal: this.state.searchFormObject.searchVal
    };
    let searchType = searchFormObject["searchType"];
    let searchVal = searchFormObject["searchVal"];
    let match = this.state.match;
    let limit = this.state.limit;
    let type = this.state.searchCheckFrom;

    if (checkFrom(type, searchVal).status) {
      if (this.props.submit) {
        let obj = {};
        obj[searchType] = searchVal;
        this.props.submit(obj);
      }
    } else {
      alert(checkFrom(type, searchVal).msg);
    }
  }

  selectRenderInputView() {
    let searchType = this.state.searchFormObject["searchType"];

    if (searchType != "") {
      return (
        <li>
          <div className="input-box">
            <input
              type="text"
              name="searchVal"
              value={this.state.searchFormObject["searchVal"]}
              onChange={this.handleChange.bind(this)}
              placeholder={`${
                lang["zh-cn"]["form"]["placeholder"][
                  this.state.searchFormObject["searchType"]
                ]
              }`}
            />
          </div>
        </li>
      );
    }
  }

  render() {
    return (
      <div className="tool" style={{ marginBottom: "10px" }}>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <ul className="form-list">
            <li>
              <div className="input-box" data-type="select">
                <select
                  name="searchType"
                  onChange={e => this.handleChange(e, true)}
                >
                  <option value="" key="role-default">
                    请选择搜寻条件
                  </option>
                  {this.props.selectOptions &&
                    this.props.selectOptions.map((key, index) => {
                      return (
                        <option value={key.val} key={index} type={key.type}>
                          {key.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </li>
            {this.selectRenderInputView()}
            {this.props.search}

            <li>
              <button type="submit" className="search-submit">
                搜寻
              </button>
            </li>
          </ul>
        </form>
      </div>
    );
  }
}
