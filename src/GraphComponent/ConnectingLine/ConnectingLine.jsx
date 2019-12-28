import React, { Component } from 'react';
export default class ConnectingLine extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div >
                <svg className="svg" id="svg">
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#f00" />
                        </marker>
                    </defs>
                    <line className="line" id="line"
                        x1={this.props.x1}
                        y1={this.props.y1}
                        x2={this.props.x2}
                        y2={this.props.y2} 
                        marker-end="url(#arrow)"/>
                </svg>
            </div>
        );
    }
}