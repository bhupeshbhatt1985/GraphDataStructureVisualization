import React, { Component } from 'react';
export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    requiredNodeSeprator() {

    }
    render() {
        return (


            <div className={this.props.className} id={this.props.value} >{this.props.value}</div>

        );
    }
}