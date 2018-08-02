import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Line }                                       from 'react-chartjs-2';

//Jsons
import lang                                           from "../../json/multi_language.json";

//Components
import ToolDashboard                                  from '../tool/dashboard';
import DashboardItem                                  from "./dashboardItem";

//Actions
import { home }                                       from "../../actions/home";

@connect((state,props)=>{
  return{
    total               : state.home.total,
    newUserCount        : state.home.newUserCount,
    userBindCount       : state.home.userBindCount,
    userStatisticsInfo  : state.home.userStatisticsInfo,
    chargeUserCount     : state.home.chargeUserCount,
    chargeSum           : state.home.chargeSum,
    pokerTaxScore       : state.home.pokerTaxScore,
    newChargeUserCount  : state.home.newChargeUserCount,
    newUserBindRate     : state.home.newUserBindRate,
    dataPoints          : state.home.dataPoints,
  }
})

export default class Home extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      total               : props.total,
      newUserCount        : props.newUserCount,
      userBindCount       : props.userBindCount,
      userStatisticsInfo  : props.userStatisticsInfo,
      chargeUserCount     : props.chargeUserCount,
      chargeSum           : props.chargeSum,
      pokerTaxScore       : props.pokerTaxScore,
      newChargeUserCount  : props.newChargeUserCount,
      newUserBindRate     : props.newUserBindRate,
      dataPoints          : props.dataPoints,
      showView            : "hide"
    }
  }

  componentDidMount() {
    this.props.dispatch(home());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      total               : nextProps.total,
      newUserCount        : nextProps.newUserCount,
      userBindCount       : nextProps.userBindCount,
      userStatisticsInfo  : nextProps.userStatisticsInfo,
      chargeUserCount     : nextProps.chargeUserCount,
      chargeSum           : nextProps.chargeSum,
      pokerTaxScore       : nextProps.pokerTaxScore,
      newChargeUserCount  : nextProps.newChargeUserCount,
      newUserBindRate     : nextProps.newUserBindRate,
      dataPoints          : nextProps.dataPoints
    })
  }

  checkSearchFormObject(object){
    let channelIds  = object['channelIds'];
    let showState   = "hide";
    if( channelIds.length>0 ){
      showState = "show";
    }
    this.setState({
      showView : showState
    })
  }

  render(){
    return(
      <section class="content">

        <ToolDashboard match={this.props.match} checkSearchFormObject={this.checkSearchFormObject.bind(this)}/>

        <section className={`main-block home-main-block`}>
          {
            Object.keys(lang['zh-cn']['page']['Dashboard']).map((key,i)=>{
              return <DashboardItem key={i} val={this.state[key]} blockTitle={lang['zh-cn']['page']['Dashboard'][key]}/>
            })
          }
        </section>

        <section className={`main-block chart`}>
          <Line
              data    = {this.state.dataPoints}
              options = {{maintainAspectRatio: false}}
              height  = {500}
              width   = {700}
          />
        </section>
      </section>
    )
  }
}
