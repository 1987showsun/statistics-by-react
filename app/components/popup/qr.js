import React from 'react';
import axios from "axios";
import {connect} from 'react-redux';

import { setup } from "../../actions/setup";

@connect((state)=>{
    return{
        popup : state.popup
    }
})

export default class Qr extends React.Component{

    constructor(props){
        super();
        this.state = {
            popup : props.popup,
            qrSrc : "",
        }
    }

    componentDidMount() {
        const id = this.state.popup['match']['params']['id'];
        getqrCodeInfo(id).then(res=>{
            this.setState({
                qrSrc : res
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            popup : nextProps.popup
        })
    }

    render(){
        return(
            <div className="qrImages">
                <img style={{'display':'block','width':'100%'}} id='base64image' src={`data:image/jpeg;base64, ${this.state.qrSrc}`} />
            </div>
        );
    }
}

const getqrCodeInfo = (id) => {
    const token   = setup().token;
    const apiUrl  = setup()['api']['qr']['getUserQr'];
    return axios.get(`${apiUrl}?userId=${id}`,{
      headers: {
        Authorization: token
      },
      responseType: 'arraybuffer'
    })
    .then((res)=>{
      return Buffer.from(res['data'], 'binary').toString('base64');
    })
  }