import React, { Component }                           from 'react';
import { connect }                                    from 'react-redux';
import { Line }                                       from 'react-chartjs-2';

//Actions
import { chargeUserCountEveryHour }                   from '../../actions/charts';

@connect((state,props)=>{
  return{
    navData                  : state.nav.navData,
    chargeUserCountEveryHour : state.charts.chargeUserCountEveryHour,
  }
})

export default class ChargeUserCountEveryHour extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      charts   : {
        charts : props.chargeUserCountEveryHour,
      }
    }
  }

  componentDidMount() {
    this.props.dispatch( chargeUserCountEveryHour() );

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      charts   : nextProps.chargeUserCountEveryHour,
    })
  }

  render(){
    return(
      <Line
          data    = {this.state.charts}
          options = {{maintainAspectRatio: false}}
          height  = {500}
          width   = {700}
      />
    );
  }
}
