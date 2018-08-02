import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Link, HashRouter } from "react-router-dom";
import $ from "jquery";

//Javascripts
import { sort } from "../../public/javascripts/sort";

//Components
import Loading from "./loading";

//Actions

@connect((state, props) => {
  return {};
})
export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theadKey: function() {
        let allKeys   = [];
        let sortKeys  = [];
        props.columns.map((key, i) => {
          allKeys.push(key["columnEnName"]);
          sortKeys.push({ sort: 1 });
        });
        return {
          allKeys  : allKeys,
          sortKeys : sortKeys
        };
      },
      wantAddLinkKey: [
        "username",
        "roleName",
        "menuName",
        "columnName",
        "channelName",
        "name",
        "brandName",
        "requestParams"
      ],
      dataSource      : props.dataSource,
      fixedKey        : props.fixedKey,
      selectedLi      : 0,
      selectSortKey   : "id",
      sortKeyStatus   : [{}],
      ignoreObjectCount : props.ignoreObjectCount || -1,
    };
  }

  componentDidMount() {
    let sortKeyStatus = this.state.sortKeyStatus;
    this.state.theadKey().allKeys.map((key, i) => {
      sortKeyStatus[0][key] = 0;
    });
    this.setState({
      sortKeyStatus: sortKeyStatus
    });
  }

  componentWillReceiveProps(nextProps) {
    let dataSource        = Object.assign([], nextProps.dataSource);
    let key               = this.state.selectSortKey;
    let sortKeyStatus     = this.state.sortKeyStatus[0][key];
    let ignoreObjectCount = this.state.ignoreObjectCount;
    let newDataSource     = [];
    let fristDataSource   = [];

    if( ignoreObjectCount!=-1 ){
      fristDataSource = [dataSource[ignoreObjectCount]];
      dataSource.map((item,i)=>{
        if( i!=ignoreObjectCount ){
          newDataSource = [ ...newDataSource , item ];
        }
      });
      dataSource = [ ...fristDataSource, ...sort(newDataSource, key, sortKeyStatus).reSortData ];
    }else{
      dataSource = sort(dataSource, key, sortKeyStatus).reSortData;
    }

    this.setState({
      dataSource: dataSource
    });
  }

  tableContentPa2() {
    let theadKey = this.state.theadKey().allKeys;

    return (
      <ul className="table-list">
        {theadKey.map((key, k) => {
          return (
            <li key={k}>
              <ul>
                <li className={`t-head`} data-sort={this.state.sortKeyStatus[0][key]} onClick={this.sortData.bind( this, this.props.columns[k]["id"], key )} >
                  {this.props.columns[k]["columnName"]}
                </li>
                {this.state.dataSource.map((item, i) => {
                  
                  if (this.state.wantAddLinkKey.includes(key)) {
                    if (key === "requestParams") {
                      return (
                        <li
                          className={`${this.returnClass(i + 1)}`}
                          key={i + 1}
                          onMouseOver={this.hoverBlock.bind(this, i + 1)}
                          onMouseOut={this.hoverBlock.bind(this, 0)}
                        >
                          <a
                            onClick={e => this.props.openPopup(item)}
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              width: "280px"
                            }}
                          >
                            {item[key]}
                          </a>
                        </li>
                      );
                    } else {
                      return (
                        <li
                          className={`${this.returnClass(i + 1)}`}
                          key={i + 1}
                          onMouseOver={this.hoverBlock.bind(this, i + 1)}
                          onMouseOut={this.hoverBlock.bind(this, 0)}
                        >
                          <Link to={`${this.props.url}/${item["id"]}`}>
                            {item[key]}
                          </Link>
                        </li>
                      );
                    }
                  } else {
                    return (
                      <li
                        className={`${this.returnClass(i + 1)}`}
                        key={i + 1}
                        onMouseOver={this.hoverBlock.bind(this, i + 1)}
                        onMouseOut={this.hoverBlock.bind(this, 0)}
                      >
                        <p>{item[key]}</p>
                      </li>
                    );
                  }
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }

  hoverBlock(selectLength) {
    this.setState({
      selectedLi: selectLength
    });
  }

  returnClass(test) {
    let selectedLi = this.state.selectedLi;
    if (test == selectedLi) {
      return "hover";
    } else {
      return "";
    }
  }

  sortData(id, key) {
    let dataSource        = Object.assign([], this.state.dataSource);
    let sortKeyStatus     = this.state.sortKeyStatus;
    let selectSortKey     = this.state.selectSortKey;
    let ignoreObjectCount = this.state.ignoreObjectCount;
    let newDataSource     = [];
    let fristDataSource   = [];

    Object.keys(sortKeyStatus[0]).map((keyItem, i) => {
      if (keyItem != key) {
        sortKeyStatus[0][keyItem] = 0;
      }
    });

    selectSortKey = key;
    sortKeyStatus[0][key] = sortKeyStatus[0][key] + 1;

    if (sortKeyStatus[0][key] > 2) {
      selectSortKey         = "id";
      sortKeyStatus[0][key] = 0;
    }

    if( ignoreObjectCount!=-1 ){
      fristDataSource = [dataSource[ignoreObjectCount]];
      dataSource.map((item,i)=>{
        if( i!=ignoreObjectCount ){
          newDataSource = [ ...newDataSource , item ];
        }
      });
      dataSource = [ ...fristDataSource, ...sort(newDataSource, key, sortKeyStatus[0][key]).reSortData ];
    }else{
      dataSource = sort(dataSource, key, sortKeyStatus[0][key]).reSortData;
    }

    //dataSource = sort(dataSource, key, sortKeyStatus[0][key]).reSortData;
    

    this.setState({
      selectSortKey  : selectSortKey,
      sortKeyStatus  : sortKeyStatus,
      dataSource     : dataSource
    });
  }

  render() {
    return (
      <div className="main-block">
        <div className="block">
          {this.props.dataSource &&
            this.props.dataSource.length == 0 && (
              <div className="table">
                <div className="noData">無任何資料</div>
                <Loading />
              </div>
            )}
          {this.props.dataSource &&
            this.props.dataSource.length > 0 && (
              <div className="table">
                {this.tableContentPa2()}
                <Loading />
              </div>
            )}
        </div>
      </div>
    );
  }
}
