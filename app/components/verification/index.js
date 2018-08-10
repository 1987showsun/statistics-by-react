import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button, message } from 'antd';
import { setup } from "../../actions/setup";
import axios from 'axios';

const apiUrl = setup().apiUrl;
const token = setup().token;
const confirm = Modal.confirm;

@connect((state, props) => {
  return {};
})

export default class VerifyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(sessionStorage.getItem("user")),
      pngLoading: false,
      closeLoading: false,
      pngUrl: "",
      showEnableVerify: false,
      showCloseVerify: false,
      verifyCode: '',
      closeVerifyCode: ''
    };
  }

  colseConfirm = () => {
    confirm({
      title: '确认要关闭两步验证?',
      content: '关闭后您的账户可能会存在风险！',
      onOk: () => {
        this.setState({ showCloseVerify: true });
      },
      onCancel() { },
    });
  }

  enableVerify = () => {
    this.setState({ pngLoading: true });
    axios.get(`${apiUrl}user/getGoogleAuthQrCode`, {
      headers: {
        Authorization: token,
      },
      responseType: 'arraybuffer'
    })
      .then((response) => {
        this.setState({
          pngLoading: false,
          pngUrl: `data:image/png; base64,${Buffer.from(response.data, 'binary').toString('base64')}`,
          showEnableVerify: true
        });
      })
  }

  submitVerify = () => {
    axios.post(`${apiUrl}user/bindGoogleAuth`, {}, {
      headers: {
        Authorization: token,
      },
      params: {
        code: this.state.verifyCode
      }
    })
      .then((response) => {
        if (response.data.code == 0) {
          sessionStorage.setItem('twoStepVerifyStatus', 1);
          this.this.setState({ user: JSON.parse(sessionStorage.getItem("user")) });
        };
        message.success(response.data.msg)
      })
  }

  submitCloseVerify = () => {
    axios.post(`${apiUrl}user/unBindGoogleAuth`, {}, {
      headers: {
        Authorization: token,
      },
      params: {
        code: this.state.closeVerifyCode
      }
    })
      .then((response) => {
        if (response.data.code == 0) {
          sessionStorage.setItem('twoStepVerifyStatus', 2);
          this.this.setState({ user: JSON.parse(sessionStorage.getItem("user")) });
        };
        message.success(response.data.msg)
      })
  }


  render() {
    const isTwoStepClose = this.state.user["twoStepVerifyStatus"] == 2;

    return (
      <main>
        <div className="home-content">
          <article className="home-content-center">
            <div style={{ width: "100%" }}>
              <p>
                用户名: {this.state.user["userName"]} <br />
                用户昵称: {this.state.user["nickName"]} <br />
                两步验证状态: {!isTwoStepClose ? '已开启两步验证' : '未开启两步验证'}
              </p>
              {
                this.state.showEnableVerify &&
                <div style={{ marginBottom: '15px' }}>
                  <img src={this.state.pngUrl} />
                  <div className="input-box" style={{ marginLeft: '17px' }}>
                    <input type="text"
                      className="datetimeInput"
                      name="verifyCode"
                      placeholder="验证码"
                      onChange={e => this.setState({ verifyCode: e.target.value })}
                      value={this.state.verifyCode}
                    />
                  </div>
                </div>
              }
              {
                this.state.showCloseVerify &&
                <div style={{ marginBottom: '15px' }}>
                  <div className="input-box" style={{ marginLeft: '17px' }}>
                    <input type="text"
                      className="datetimeInput"
                      name="closeVerifyCode"
                      placeholder="验证码"
                      onChange={e => this.setState({ closeVerifyCode: e.target.value })}
                      value={this.state.closeVerifyCode}
                    />
                  </div>
                </div>
              }
              <p>
                {
                  !isTwoStepClose &&
                  <Button onClick={this.colseConfirm} style={{ marginRight: '5px' }}>
                    关闭两步验证
                  </Button>
                }
                {
                  (isTwoStepClose && !this.state.showEnableVerify) &&
                  <Button onClick={this.enableVerify} style={{ marginRight: '5px' }} loading={this.state.pngLoading}>
                    开启两步验证
                  </Button>
                }
                {
                  this.state.showEnableVerify &&
                  <Button onClick={this.submitVerify}>
                    提交
                  </Button>
                }
                {
                  this.state.showCloseVerify &&
                  <Button onClick={this.submitCloseVerify}>
                    提交
                  </Button>
                }
              </p>
            </div>
          </article>
        </div>
      </main>
    );
  }
}