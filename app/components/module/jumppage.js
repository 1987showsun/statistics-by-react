import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, NavLink } from 'react-router-dom';

export default class Jumppage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: props.url,
            totalPage: props.totalPage,
            nowPage: props.nowPage,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            totalPage: nextProps.totalPage,
            nowPage: nextProps.nowPage,
        })
    }

    handleChange(e) {
        let name = e.target.name;
        let val = e.target.value;
        this.setState({
            nowPage: val,
        })
    }

    render() {
        return (
            <form className="jumppage">
                <ul>
                    <li>
                        <input type="number" name="jumpNumber" value={this.state.nowPage} onChange={this.handleChange.bind(this)} min="1" max={this.state.totalPage} className="input" />
                        <button type="button" className="btn" style={{background: '#1890ff',color: '#fff'}}>
                            <NavLink style={{color: '#fff'}} to={`${this.state.url}${this.state.nowPage}`}>前往</NavLink>
                        </button>
                    </li>
                </ul>
            </form>
        );
    }
}
