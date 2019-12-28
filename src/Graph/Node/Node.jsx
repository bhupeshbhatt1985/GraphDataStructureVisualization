import React, { Component } from 'react';
export default class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: null,
        };
    }
    componentDidMount() {
        var Id = this.props.Id;
        var offset = document.getElementById(Id).getBoundingClientRect();
        //return offset;
        //this.setState({ offset: offset });
        this.prepareLinebetweenNodes(offset);
    }


    prepareLinebetweenNodes(offset) {
        var x1 = offset.left + (offset.width / 2);
        var y1 = offset.top + (offset.height / 2);
        //var x2 = offset.left + (div2.width() / 2);
        //var y2 = offset.top + (div2.height() / 2);
        var x2 = x1 * 2;
        var y2 = y1 * 2;
        this.setState({ x1: x1, x2: x2, y1: y1, y2: y2 });

    }
    render() {
        return (
            <div >
                <div className="node" id={this.props.Id} >{this.props.value}</div>
                <svg className="svg" id="svg">
                    <line className="line" id="line" x1={this.state.x1}
                        y1={this.state.y1}
                        x2={this.state.x2}
                        y2={this.state.y2} />
                </svg>
            </div>
        );
    }
}