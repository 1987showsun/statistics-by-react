import React, { Component } from "react";
import { connect } from "react-redux";

//Components
import CheckBoxOption from "./checkBoxOption";

@connect((state, props) => {
  return {};
})
export default class CheckBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionSwitchStatus : "hide",
      allChannelList     : [],
      selectedItems      : props.checkBoxSetup["selectedData"],
      searchFormObject   : props.searchFormObject,
      useApiUrl          : props.useApiUrl || "http://192.168.211.1:8090/admin/channel/list",
    };
  }

  selectSwitch(status) {
    this.setState({
      optionSwitchStatus: status
    });
  }

  selectedPushObject(selectedItem) {
    let selectedItems = this.state.selectedItems;
    let searchFormObject = this.state.searchFormObject;
    let isRepeat = false;

    selectedItems.map((item, i) => {
      if (item["checkBoxId"] == selectedItem["checkBoxId"]) {
        isRepeat = true;
      }
    });

    if (!isRepeat) {
      if (this.props.checkBoxSetup["multiple"]) {
        selectedItems.push(selectedItem);
        Object.keys(searchFormObject).map((key, i) => {
          if (typeof searchFormObject[key] == "object") {
            searchFormObject[key] = [];
            selectedItems.map((item, k) => {
              searchFormObject[key].push(item[key]);
            });
          }
        });
      } else {
        selectedItems[0] = selectedItem;
      }
    }

    this.props.checkBoxBackArray(selectedItems);
    this.selectSwitch("hide");
  }

  removeChannelId(selectItem) {
    let selectedItems = this.state.selectedItems;
    let searchFormObject = this.state.searchFormObject;

    selectedItems.map((item, i) => {
      if (item.checkBoxId == selectItem.checkBoxId) {
        selectedItems.splice(i, 1);
      }
    });

    this.props.checkBoxBackArray(selectedItems);
  }

  render() {
    return (
      <div className="multiple" style={{ position: "relative", minWidth: "200px" }}>
        <div
          className="input-box"
          data-type="check-select"
          style={{
            fontSize  : ".8em",
            alignItem : "center",
            display   : "flex",
            padding   : "0px 30px 0px 0px"
          }}
        >
          {this.state.selectedItems &&
            this.state.selectedItems.length === 0 && (
              <div className="null">请选择选项</div>
            )}

          <div className="showOption">
            {this.state.selectedItems.map((item, i) => {
              return (
                <div key={i} className="option">
                  {item.checkBoxName}
                  <span
                    className="btn optinRemove"
                    onClick={this.removeChannelId.bind(this, item)}
                  />
                </div>
              );
            })}
          </div>
          <div
            className="touchBlock"
            onClick={this.selectSwitch.bind(this, "show")}
          />
        </div>

        <CheckBoxOption
          useApiUrl              = {this.state.useApiUrl}
          checkBoxSetup          = {this.props.checkBoxSetup}
          selectedItems          = {this.props.checkBoxSetup["selectedData"]}
          searchFormObject       = {this.state.searchFormObject}
          optionSwitchStatus     = {this.state.optionSwitchStatus}
          selectedPushObject     = {this.selectedPushObject.bind(this)}
          selectSwitch           = {this.selectSwitch.bind(this)}
        />
      </div>
    );
  }
}
