import React, { Component } from "react";
import { connect } from "react-redux";

//Components
//import Table from "../module/table";
import { Table, Pagination } from "antd";
import axios from "axios";
import { setup } from "../../actions/setup";
import { changeDate } from "../../public/javascripts/date";
@connect((state, props) => {
  return {
    navData: state.nav.navData,
    channelHistoryData: state.channelHistoryList
  };
})
export default class ChannelHistoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match: props.match,
      navData: props.navData,

      channelHistoryData: [],
      columns: [],
      loading: false,
      pagination: {},
      params: "",
      sorter: {}
    };
  }
  componentDidMount() {
    if (this.state.navData && this.state.navData.length > 0) {
      this.state.navData.map((item, i) => {
        if (item.pageColumns && item.pageColumns.length > 0) {
          item.pageColumns.map((column, index) => {
            let data = {};
            data.dataIndex = column.columnEnName;
            data.title = column.columnName;
            data.sorter = true;
            data.align = "center";
            data.sortOrder = null;
            this.state.columns.push(data);
          });
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps &&
      nextProps.channelHistoryData.params !== this.state.params
    ) {
      const pagination = { ...this.state.pagination };
      pagination.total = nextProps.channelHistoryData.total;
      pagination.page = 1;
      pagination.pageSize = nextProps.channelHistoryData.limit;
      this.setState({
        channelHistoryData: nextProps.channelHistoryData["list"],
        tableContentObject: nextProps,
        pagination,
        params: nextProps.channelHistoryData.params
      });
    }
  }

  onChange(page, pageSize) {
    const pager = { ...this.state.pagination };
    pager.page = page;
    pager.total = pageSize;
    this.setState({
      pagination: pager
    });
    this.fetch({
      page: page,
      ...this.state.sorter
    });
  }

  tableOnChange(pagination, filters, sorter) {
    const direction = {
      ascend: "ASC",
      descend: "DESC"
    };
    const sorterParams = {
      orderBy: sorter.columnKey,
      orderDirection: direction[sorter.order]
    };
    const pager = { ...this.state.pagination };
    pager.page = 1;
    this.setState({
      pagination: pager,
      sorter: sorterParams
    });
    this.fetch({
      page: 1,
      ...sorterParams
    });
  }

  fetch = (params = {}) => {
    this.setState({ loading: true });
    axios
      .get(`${setup().api[3].list}${this.state.params}`, {
        headers: {
          Authorization: setup().token
        },
        params: {
          ...params
        }
      })
      .then(data => {
        const Data = data.data.data;
        const pagination = { ...this.state.pagination };
        pagination.total = Data.total;
        let list = [];
        if (Data.hasOwnProperty("list")) {
          list = Data.list;
          if (list && list.length >= 0) {
            list.map((item, i) => {
              item["createTime"] = changeDate(item["createTime"]);
            });
          }
        }
        this.setState({
          loading: false,
          channelHistoryData: list,
          pagination
        });
      });
  };

  render() {
    const data = this.state.channelHistoryData.map((el, i) => {
      el.id = i;
      return el;
    });
    return (
      <div style={{ background: "#ffffff", margin: "5px 0px" }}>
        <Table
          pagination={false}
          rowKey="id"
          columns={this.state.columns}
          // dataSource={this.state.channelHistoryData}
          dataSource={data}
          rowKey="id"
          onChange={(pagination, filters, sorter) =>
            this.tableOnChange(pagination, filters, sorter)
          }
          scroll={{ x: true, y: 400 }}
        />

        {this.state.pagination.total > 0 && (
          <Pagination
            current={this.state.pagination.page}
            total={this.state.pagination.total}
            pageSize={this.state.pagination.pageSize}
            onChange={(page, pageSize) => this.onChange(page, pageSize)}
            style={{ padding: "30px", textAlign: "center" }}
          />
        )}
      </div>
    );
  }
}
