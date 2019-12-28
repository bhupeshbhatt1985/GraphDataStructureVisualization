import React, { Component } from 'react';
export default class AddEdge extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <form className="newEdgeForm">
                <input className="txt" type="text" value={this.props.to} placeholder="to" name="to" onChange={this.props.handleInputChange}></input>
                <input className="txt" type="text" value={this.props.from} placeholder="from" name="from" onChange={this.props.handleInputChange}></input>
                <input type="button" className="btn" value="Directed Edge" 
                onClick={this.props.saveNewDirectedEdge}></input>
                <input type="button" className="btn" value="UnDirected Edge" 
                onClick={this.props.saveNewUnDirectedEdge}></input>
                <input type="button" className="btn" value="Count Path" 
                onClick={this.props.countPathBetweenNodes}></input>
               
            </form>
        );
    }
}