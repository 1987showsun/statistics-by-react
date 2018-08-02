import React,{ Component }                            from 'react';
import { connect }                                    from 'react-redux';
import { Route, Link }                                from 'react-router-dom';
import $                                              from 'jquery';

@connect((state,props)=>{
  return{
    loading : state.loading.complete
  }  
})

export default class Loading extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loading : props.loading
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading : nextProps.loading
    })
  }

  render(){
    return(
      <div className={`loading ${ !this.state.loading? "show" : "hide" }`}>
        <h2>Loading Data</h2>
        <div className="action">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
}
