import React, { Component }                           from 'react';
import { connect }                                    from 'react-redux';
import { NavLink }                                    from 'react-router-dom';

//Components
import Jumppage from './jumppage';

export default class NumberPage extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      showMaxNumberPage   : 6,
      total               : props.total,
      limit               : props.limit,
      match               : props.match,
      totalPage           : [],
      noToHeader          : false,
      noToFooter          : false,
    }
  }

  componentDidMount() {
    let total         = this.state.total;
    let limit         = this.state.limit;
    let totalPage     = [];
    let maxPageNumber = Math.ceil(total/limit);

    for( let i=1 ; i <= maxPageNumber ; i++ ){
      totalPage.push(i);
    }

    this.setState({
      totalPage : totalPage,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      match : nextProps.match,
      total : nextProps.total,
      limit : nextProps.limit,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.total!=this.state.total){
      let total         = this.state.total;
      let limit         = this.state.limit;
      let totalPage     = [];
      let maxPageNumber = Math.ceil(total/limit);

      for( let i=1 ; i <= maxPageNumber ; i++ ){
        totalPage.push(i);
      }

      this.setState({
        totalPage : totalPage
      });
    }
  }

  checkHaveNowPageNumber(i){
    if( this.state.match['params']['nowPageNumber']==undefined ){
      if( i==0 ){
        return "active";
      }
    }else{
      return "";
    }
  }

  showPageRange(){
    let totalPage                = Object.assign([],this.state.totalPage);
    let totalPageArrayLength     = totalPage.length;
    let showMaxNumberPage        = Number(this.state.showMaxNumberPage);
    let showMaxNumberPageCenter  = Number(Math.ceil(showMaxNumberPage/2));
    let nowPageNumber            = Number(this.state.match['params']['nowPageNumber']) || 1;
    let minRange                 = 0;
    let maxRange                 = 0;
    let noToHeader               = this.state.noToHeader;
    let noToFooter               = this.state.noToFooter;

    if(  nowPageNumber <= showMaxNumberPageCenter){

      minRange   = 0;
      maxRange   = showMaxNumberPage-1;
      noToHeader = false;
      noToFooter = true;


    }else if( nowPageNumber > showMaxNumberPageCenter  && nowPageNumber < totalPageArrayLength ){

      minRange    = (nowPageNumber - showMaxNumberPageCenter)-1;
      maxRange    = (nowPageNumber + showMaxNumberPageCenter)-2;
      noToHeader  = true;
      noToFooter  = true;

      if( maxRange>=totalPageArrayLength ){
        if( Number.isInteger(showMaxNumberPage/2) ){
          minRange = nowPageNumber - Math.pow(2,((showMaxNumberPage/2)-1)) - 1;
        }else{
          minRange = ""
        }
      }

    }else if( nowPageNumber >= totalPageArrayLength ){

      noToHeader = true;
      noToFooter = false;
      maxRange   = (nowPageNumber + showMaxNumberPageCenter) - 1;

      if( Number.isInteger(showMaxNumberPage/2) ){
        minRange = nowPageNumber - (showMaxNumberPageCenter*2);
      }else{
        //如果是整數就少顯示一個頁數
        minRange = nowPageNumber - (showMaxNumberPageCenter*2) + 1 ;
      }
    }

    return this.state.totalPage.map((item,i)=>{
      if( i >= minRange && i <= maxRange ){
        return(
          <li key={i}><NavLink className={`${this.checkHaveNowPageNumber(i)}`} to={`/${this.state.match.params.type}/${this.state.match.params.page}/${item}`}>{item}</NavLink></li>
        );
      }
    })
  }

  showFirstNumber(){
    let nowPageNumber            = this.state.match['params']['nowPageNumber'] || 1;
    let totalPage                = Object.assign([],this.state.totalPage);
    let totalPageArrayLength     = totalPage.length;
    let showMaxNumberPage        = Number(this.state.showMaxNumberPage);
    let showMaxNumberPageCenter  = Number(Math.floor(showMaxNumberPage/2));

    if( nowPageNumber>showMaxNumberPageCenter+1 ){
      return(
        <div className="numberPage">
          <ul className="numberPage-list">
            <li><NavLink to={`/${this.state.match.params.type}/${this.state.match.params.page}/1`}>1</NavLink></li>
          </ul>
          <span className="null">···</span>
        </div>
      );
    }
  }

  showLastNumber(){
    let nowPageNumber            = this.state.match['params']['nowPageNumber'] || 1;
    let totalPage                = Object.assign([],this.state.totalPage);
    let totalPageArrayLength     = totalPage.length;
    let showMaxNumberPage        = Number(this.state.showMaxNumberPage);
    let showMaxNumberPageCenter  = Number(Math.floor(showMaxNumberPage/2));

    if( totalPageArrayLength>showMaxNumberPage ){
      if( nowPageNumber < totalPageArrayLength-(showMaxNumberPageCenter-1) ){
        return(
          <div className="numberPage">
            <span className="null">···</span>
            <ul className="numberPage-list">
              <li><NavLink to={`/${this.state.match.params.type}/${this.state.match.params.page}/${totalPageArrayLength}`}>{totalPageArrayLength}</NavLink></li>
            </ul>
          </div>
        );
      }
    }
  }

  render(){
    return(
      <div className="main-block-numberPage">
        { this.showFirstNumber() }
        <ul className="numberPage-list">
          { this.showPageRange() }
        </ul>
        { this.showLastNumber() }
        <div className="numberPage-list" style={{marginLeft: '5px'}}>
          <Jumppage
            nowPage={this.state.match['params']['nowPageNumber'] || 1}
            totalPage={this.state.totalPage.length || 1}
            url={`/${this.state.match.params.type}/${this.state.match.params.page}/`}
          />
        </div>
      </div>

    );
  }
}
