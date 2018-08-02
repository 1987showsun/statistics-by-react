import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Link }                                       from 'react-router-dom';

//Jsons
import lang                                           from "../../json/multi_language.json";

export default class DashboardItem extends React.Component{
  render(){
    return (
      <div className="data">
        <div className="data-block">
          <article className="data-block-title">
            <h3>{this.props.blockTitle}</h3>
          </article>
          <div className="data-block-content">
            <span className="val">{this.props.val}</span>
          </div>
        </div>
      </div>
    );
  }
}
