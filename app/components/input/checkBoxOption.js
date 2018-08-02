import React, { Component } from "react";
import Axios from "axios";

//Jsons
import lang from "../../json/multi_language";

let searchDelayTime;

export default class CheckBoxOption extends React.Component {
  constructor(props) {
    super(props);

    let checkBoxSetup = props.checkBoxSetup;
    if (checkBoxSetup["showSearchBox"]) {
      checkBoxSetup[checkBoxSetup["inputName"]] = "";
    }

    this.state = {
      checkBoxSetup: checkBoxSetup,
      searchVal: "",
      data: [],
      selectedItems: props.selectedItems,
      searchFormObject: props.searchFormObject,
      useApiUrl: props.useApiUrl,
      noData: lang["zh-cn"]["note"]["noSearchVal"],
      reload: true,
      maxPage: 1,
      currentPage: 1,
      params: {
        [checkBoxSetup["inputName"]]: "",
        limit: 10,
        page: 1
      }
    };
  }

  componentDidMount() {
    const checkBoxSetup = this.state.checkBoxSetup;

    if (!checkBoxSetup["showSearchBox"]) {
      let useApiUrl = this.state.useApiUrl;
      let params = {};
      this.setState(
        {
          reload: false
        },
        () => {
          getOption(useApiUrl, params).then(res => {
            let data = [];
            let noDataMsg = "";
            switch (checkBoxSetup["wantUseApi"]) {
              case "allRole":
                data = role(res["data"]["data"]);
                break;

              case "allMenu":
                data = menu(res["data"]["data"]);
                break;

              case "allBrand":
                data = brand(res["data"]["data"]);
                break;

              default:
                break;
            }

            if (data.length <= 0) {
              noDataMsg = lang["zh-cn"]["note"]["searchNoData"];
            }

            this.setState({
              noData: noDataMsg,
              data: data,
              reload: true
            });
          });
        }
      );
    }
  }

  componentDidUpdate() {
    if (this.nameInput) this.nameInput.focus();
  }

  handleChange(e) {
    let checkBoxSetup = this.state.checkBoxSetup;
    let params = this.state.params;
    let name = e.target.name;
    let val = e.target.value;

    params[name] = val;
    params["page"] = 1;
    checkBoxSetup[name] = val;

    this.setState(
      {
        params,
        data: [],
        checkBoxSetup: checkBoxSetup
      },
      () => {
        clearTimeout(searchDelayTime);
        searchDelayTime = setTimeout(() => {
          if (val != "") {
            this.axiosData();
          }
        }, 500);
      }
    );
  }

  scrollBottomReloadRender() {
    let _this = this;
    let $touchClass = $(".selctoption");
    let $touchWrapClass;
    let _touchClassHeigth = 0;
    let _touchWrapClassHeight = 0;
    let _totalHeigth = 0;

    let reload = this.state.reload;
    let params = this.state.params;
    let maxPage = this.state.maxPage;

    $touchClass.scroll(function() {
      $touchWrapClass = $(this).find(".scroll-wrap");
      _touchClassHeigth = $(this).height();
      _touchWrapClassHeight = $touchWrapClass.height();
      _totalHeigth = _touchClassHeigth + $(this).scrollTop();

      if (reload) {
        if (_totalHeigth == _touchWrapClassHeight) {
          if (params["page"] < maxPage) {
            params["page"]++;
            _this.setState(
              {
                params
              },
              () => {
                _this.axiosData();
              }
            );
          }
        }
      }
    });
  }

  axiosData() {
    let params = this.state.params;
    let noDataMsg = this.state.noData;
    let useApiUrl = this.state.useApiUrl;
    let checkBoxSetup = this.state.checkBoxSetup;
    let data = this.state.data;

    this.setState(
      {
        reload: false
      },
      () => {
        getOption(useApiUrl, params).then(res => {
          const currentPage = Number(res["data"]["data"]["currentPage"]);
          const total = Number(res["data"]["data"]["total"]);
          const limit = Number(res["data"]["data"]["limit"]);
          const maxPage = Math.ceil(total / limit);

          switch (checkBoxSetup["wantUseApi"]) {
            case "searchChannel":
              data = [...data, ...channel(res["data"]["data"])];
              break;

            case "searchUserChannel":
              data = [...data, ...channelByUser(res["data"]["data"])];
              break;

            case "searchUser":
              data = [...data, ...user(res["data"]["data"])];
              break;

            case "searchBrand":
              data = [...data, ...brand(res["data"]["data"])];
              break;

            case "searchMenu":
              data = [...data, ...menu(res["data"]["data"])];
              break;
          }

          if (data.length <= 0) {
            noDataMsg = lang["zh-cn"]["note"]["searchNoData"];
          }

          this.setState(
            {
              noData: noDataMsg,
              reload: true,
              currentPage,
              maxPage,
              data
            },
            () => {
              if (currentPage <= maxPage) {
                this.scrollBottomReloadRender();
              }
            }
          );
        });
      }
    );
  }

  selectedItem(item) {
    this.props.selectedPushObject(item);
  }

  returnSelectOptionActive(item) {
    //標記是否已被選取
    let checkHaveData = this.props.selectedItems.filter((el, i) => {
      return el["checkBoxId"] == item["checkBoxId"];
    });

    if (checkHaveData.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  inputBlur = e => {
    if (this.props.selectSwitch) {
      setTimeout(() => this.props.selectSwitch("hide"), 300);
    }
  };

  returnSearchInput() {
    //判斷是否有開啟搜尋框
    if (this.state.checkBoxSetup != undefined) {
      if (this.state.checkBoxSetup["showSearchBox"]) {
        return (
          <div className="form">
            <div className="input-box">
              {this.state.checkBoxSetup.wantUseApi && (
                <input
                  type="text"
                  name={this.state.checkBoxSetup["inputName"]}
                  value={
                    this.state.checkBoxSetup[
                      this.state.checkBoxSetup["inputName"]
                    ]
                  }
                  onBlur={this.inputBlur}
                  onChange={this.handleChange.bind(this)}
                  autoComplete="off"
                  placeholder="请输入选项名称"
                  ref={input => {
                    this.nameInput = input;
                  }}
                />
              )}
            </div>
          </div>
        );
      }
    }
  }

  render() {
    return (
      <div className={`selctoption ${this.props.optionSwitchStatus}`}>
        <div className="scroll-wrap">
          {this.returnSearchInput()}
          {this.state.data.length > 0 ? (
            this.state.data.map((item, i) => {
              return (
                <div
                  key={i}
                  className={`option ${this.returnSelectOptionActive(item)}`}
                  onClick={this.selectedItem.bind(this, item)}
                >
                  {item.checkBoxName}
                  <span className="icon fas fa-check" />
                </div>
              );
            })
          ) : (
            <div className="noData">{this.state.noData}</div>
          )}
          {!this.state.reload && (
            <div className="checkBox-loading">
              <div className="lds-css ng-scope">
                <div className="lds-spinner" style={{ height: "100%" }}>
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
            </div>
          )}
        </div>
      </div>
    );
  }
}

const getOption = (useApiUrl, checkBoxSetup) => {
  return Axios.get(`${useApiUrl}`, {
    params: checkBoxSetup,
    headers: {
      notloading: true,
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  }).then(res => {
    return res;
  });
};

const channel = data => {
  let list = [];
  data["list"].map((item, i) => {
    list = [
      ...list,
      { checkBoxId: item["id"], checkBoxName: item["channelName"] }
    ];
  });
  return list;
};

const channelByUser = data => {
  let list = [];
  data["list"].map((item, i) => {
    list = [
      ...list,
      { checkBoxId: item["channelId"], checkBoxName: item["channelName"] }
    ];
  });
  return list;
};

const user = data => {
  let list = [];
  data["list"].map((item, i) => {
    list = [
      ...list,
      { checkBoxId: item["id"], checkBoxName: item["userName"] }
    ];
  });
  return list;
};

const brand = data => {
  let list = [];

  data["list"].map((item, i) => {
    list = [
      ...list,
      { checkBoxId: item["id"], checkBoxName: item["brandName"] }
    ];
  });
  return list;
};

const role = data => {
  let list = [];
  data["list"].map((item, i) => {
    list = [
      ...list,
      { checkBoxId: item["id"], checkBoxName: item["roleName"] }
    ];
  });
  return list;
};

const menu = data => {
  let list = [];
  data["list"].map((item, i) => {
    list = [
      ...list,
      { checkBoxId: item["id"], checkBoxName: item["menuName"] }
    ];
  });
  return list;
};
