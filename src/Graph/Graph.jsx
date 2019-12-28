import React, { Component } from 'react';
import './Graph.css'
import Node from './Node/Node'

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //GraphArray: this.generateArray(),
            nodeList: this.generateArray(),
        };
    }
    generateArray() {
        /*var level = 10;
        var nodeArray = new Array(level);
        for (let i = 0; i <= level; i++) {
            nodeArray[i] = new Array(i + 1).fill(i + 1);
        }
        
         var nodeObject0 = {"level": "0", "value":"level-0"};
         var nodeObject01 = {"level": 01, "value":"level-01"};
         var nodeObject02 = {"level": 02, "value":"level-02"};
      
        var nodeList = [
            {
                "value": "1",
                "children": [
                    {
                        "value": "2",
                        "children": [
                            {
                                "value": "4",
                                "children": []
                            },
                            {
                                "value": "5",
                                "children": []
                            }
                        ]
                    },
                    {
                        "value": "3",
                        "children": [
                            {
                                "value": "6",
                                "children": []
                            },
                            {
                                "value": "7",
                                "children": []
                            }
                        ]
                    }
                ]
            },
        ]  */
        //console.log(nodeList);
        var nodeList = [
            { "Id": "1", "value": "1", "level": "1", "parentId": "0" },
            { "Id": "2", "value": "2", "level": "2", "parentId": "1" },
            { "Id": "3", "value": "3", "level": "2", "parentId": "1" },
            { "Id": "4", "value": "4", "level": "3", "parentId": "2" },
            { "Id": "5", "value": "5", "level": "3", "parentId": "3" },
            { "Id": "6", "value": "6", "level": "3", "parentId": "3" },
            { "Id": "7", "value": "7", "level": "3", "parentId": "3" },
            { "Id": "8", "value": "8", "level": "3", "parentId": "3" }]
        return nodeList;
    }
    render() {
        console.log(this.state.nodeList);
        var nodeListLocal = this.state.nodeList
        var indents = [];
        for (var i = 0; i < 3; i++) {
            var levelithNodes = nodeListLocal.filter((x) => { return x.level == i + 1; });
            indents.push(<div className="node-area">
                <div className="node-seprator"></div>
                {
                    levelithNodes.map((x) => {
                    return (<Node key={x.Id.toString()} value={x.value} Id={x.Id} parentId={x.parentId}></Node>);
                    })
                }</div>
            );
        }
        console.log(indents);
        return (
            /*<div className="content-body">
                <div className="top">
                    <button className="btn">Add Root Node</button>
                </div>
                <div className="content">
                    {
                        this.state.GraphArray.map((rows, i) => {
                            return (
                                <div className="node-area">
                                    <div className="node-seprator"></div>{
                                        rows.map((cols, j) => {
                                            return (
                                                <Node key={j.toString()} value={cols}>
                                                </Node>
                                            );
                                        })}
                                </div>);
                        })
                    }
                </div>
            </div>*/

            indents


        );

    }
}