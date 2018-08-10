import React, { Component } from "react";
import { connect } from "react-redux";
import { message } from "antd";
import axios from "axios";
import _ from "lodash";


const reg = /(user\/getGoogleAuthQrCode|)/;
//Actions
import { loadingState } from "../../actions/loading";

@connect((state, props) => {
  return {
    loadingState: state.loading.state
  };
})
export default class LoadingPage extends React.Component {
  componentWillMount() {
    axios.interceptors.request.use(
      config => {
        if (!config["headers"]["notloading"]) {
          this.props.dispatch(loadingState(true));
        }
        delete config["headers"]["notloading"];
        config["toke"] = `Bearer ${sessionStorage.getItem("token")}` || "";
        return config;
      },
      error => {
        this.props.dispatch(loadingState(true));
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      response => {
        const url = response.config.url;
        this.props.dispatch(loadingState(false));
        if(url.match(reg)) return response;
        if (response.data.code != 0) message.warning(response.data.msg);
        return response;
      },
      error => {
        const status = _
          .get(error, "response.status", 999)
          .toString()
          .substr(0, 2);
        switch (status) {
          case "40":
            message.warning("权限不足，请联系管理员");
            break;
          default:
            message.warning("服务器开了小差，稍后再试试");
        }
        this.props.dispatch(loadingState(false));
        return Promise.reject(error);
      }
    );
  }

  render() {
    return (
      this.props.loadingState && (
        <div class="loading_page">
          <div class="lds-spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      )
    );
  }
}
