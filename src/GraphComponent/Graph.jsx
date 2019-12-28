import React, { Component } from 'react';
import './Graph.css'
import Node from './Node/Node'
import AddEdge from './AddEdge/AddEdge'
import ConnectingLine from './ConnectingLine/ConnectingLine'
import Queue from './Queue.js'
import Stack from './Stack.js'

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vertices: ["0", "1", "2"],
            verticesToRendor: [["0"], ["1", "2"], []],
            adjList: new Map(),
            showAddEdgePanel: true,
            newEdge: { "to": "0", "from": "1" },
            offSetArray: [],
            TraversingOrder: [],
            currentNodeLevelRendering: 2,
            currentNodeDivsAdded: 0,
            pendingNodesToReachNextLevel: 0,
            nodeStructureArray: [1, 2, 3, 4, 3, 2],
            cycleDetected: false,
            isMotherVertex: false,

        };
        this.addNewNode = this.addNewNode.bind(this);
        this.addNewEdge = this.addNewEdge.bind(this);
        this.saveNewUnDirectedEdge = this.saveNewUnDirectedEdge.bind(this);
        this.saveNewDirectedEdge = this.saveNewDirectedEdge.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createOffsetArray = this.createOffsetArray.bind(this);
        this.searchBFS = this.searchBFS.bind(this);
        this.searchDFS = this.searchDFS.bind(this);
        this.detechCycle = this.detechCycle.bind(this);
        this.clear = this.clear.bind(this);
        this.checkIfNodeSepratorRequired = this.checkIfNodeSepratorRequired.bind(this);
        this.findMotherVertex = this.findMotherVertex.bind(this);
        this.countNodesAtLevel = this.countNodesAtLevel.bind(this);
        this.countPathBetweenNodes=this.countPathBetweenNodes.bind(this);

    }
    checkIfNodeSepratorRequired() {
        var currentNodeLevelRendering = this.state.currentNodeLevelRendering;
        var pendingNodesToReachNextLevel = this.state.nodeStructureArray[currentNodeLevelRendering];
        var currentNodeDivsAdded = this.state.currentNodeDivsAdded;
        currentNodeDivsAdded++;
        pendingNodesToReachNextLevel = pendingNodesToReachNextLevel - currentNodeDivsAdded;
        if (pendingNodesToReachNextLevel === 0) {
            //change currentlevel and other information
            var nodeStructureArraySize = this.state.nodeStructureArray.length;
            if (currentNodeLevelRendering < nodeStructureArraySize - 1) {
                currentNodeLevelRendering++;
            } else {
                currentNodeLevelRendering = 0;
            }
            //if (currentNodeLevelRendering === 0) {
            currentNodeDivsAdded = 0;
            //}
            this.setState({ currentNodeLevelRendering: currentNodeLevelRendering });
            this.setState({ currentNodeDivsAdded: currentNodeDivsAdded });
            return true;
        }
        this.setState({ currentNodeLevelRendering: currentNodeLevelRendering });
        this.setState({ currentNodeDivsAdded: currentNodeDivsAdded });
        return false;
    }
    changeCurrentLevel(currentLevel, nodeStructureArraySize) {
        if (currentLevel < nodeStructureArraySize) {
            currentLevel++;
        } else {
            currentLevel = 0;
        }
    }
    addNewNode() {
        var noOfVertices = this.state.vertices.length;
        var newNode = noOfVertices;
        var newVerticesArray = this.state.vertices.slice();
        newVerticesArray.push(newNode.toString());


        var newVerticesRendorArray = this.state.verticesToRendor.slice();
        newVerticesRendorArray[newVerticesRendorArray.length - 1].push(newNode.toString());
        if (this.checkIfNodeSepratorRequired() === true) {
            //newVerticesRendorArray.push("newLine");
            newVerticesRendorArray.push([]);
        }
        this.setState({
            vertices: newVerticesArray,
        });
        this.setState({
            verticesToRendor: newVerticesRendorArray,
        });
    }
    addNewEdge() {
        this.setState({
            showAddEdgePanel: true,
        });
    }
    handleInputChange(event) {
        const name = event.target.name;
        const localNewEdge = {};
        if (name === "to") {
            localNewEdge.to = event.target.value;
            localNewEdge.from = this.state.newEdge.from;
        }
        else if (name === "from") {
            localNewEdge.from = event.target.value;
            localNewEdge.to = this.state.newEdge.to;
        }
        this.setState({
            newEdge: localNewEdge,
        })
    }

    saveNewUnDirectedEdge(event) {
        //console.log(this.state.newEdge);
        //copy older map object
        var newAdjList = new Map(this.state.adjList);
        //now add new edge
        var to = this.state.newEdge.to.toString();
        var from = this.state.newEdge.from.toString();
        if (!!newAdjList.get(to))
            newAdjList.get(to).push(from);
        else
            newAdjList.set(to, [from]);

        if (!!newAdjList.get(from))
            newAdjList.get(from).push(to);
        else
            newAdjList.set(from, [to]);



        //console.log(newAdjList);
        this.createOffsetArray(newAdjList);
        this.setState({
            adjList: newAdjList,
        });
        event.preventDefault();
    }
    saveNewDirectedEdge(event) {
        //console.log(this.state.newEdge);
        //copy older map object
        var newAdjList = new Map(this.state.adjList);
        //now add new edge
        var to = this.state.newEdge.to.toString();
        var from = this.state.newEdge.from.toString();
        if (!!newAdjList.get(to))
            newAdjList.get(to).push(from);
        else
            newAdjList.set(to, [from]);
        //console.log(newAdjList);
        this.createOffsetArray(newAdjList);
        this.setState({
            adjList: newAdjList,
        });
        event.preventDefault();
    }
    createOffsetArray(AdjList) {
        var localOffsetArray = new Array();
        AdjList.forEach((value, key, map) => {
            var fromId = key;
            value.map((toId, i) => {
                var offsetOfFromNode = document.getElementById(fromId).getBoundingClientRect();
                var offsetOfToNode = document.getElementById(toId).getBoundingClientRect();
                var offsetObject = this.prepareLinebetweenNodes(offsetOfFromNode, offsetOfToNode);
                localOffsetArray.push(offsetObject);
                //console.log(localOffsetArray);
            });
        });
        this.setState({
            offSetArray: localOffsetArray,
        });

    }
    prepareLinebetweenNodes(offsetOfFromNode, offsetOfToNode) {

        var x1 = 0;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        //when top to bottom
        if (offsetOfFromNode.top < offsetOfToNode.top) {
            var x1 = offsetOfFromNode.left + (offsetOfFromNode.width / 2);
            var y1 = (offsetOfFromNode.bottom) - 100;
            var x2 = offsetOfToNode.left + (offsetOfToNode.width / 2);
            var y2 = (offsetOfToNode.top) - 108;
        }
        else if (offsetOfFromNode.top > offsetOfToNode.top) {
            //when bottom to top
            var x1 = offsetOfFromNode.left + (offsetOfFromNode.width / 2);
            var y1 = (offsetOfFromNode.top) - 100;
            var x2 = offsetOfToNode.left + (offsetOfToNode.width / 2);
            var y2 = (offsetOfToNode.bottom) - 92;
        }
        else if (offsetOfFromNode.top === offsetOfToNode.top) {
            //when both are in the same line
            var x1 = offsetOfFromNode.left + (offsetOfFromNode.width / 2);
            var y1 = (offsetOfFromNode.top + (offsetOfFromNode.height / 2)) - 100;
            var x2 = offsetOfToNode.left + (offsetOfToNode.width / 2);
            var y2 = (offsetOfToNode.top + (offsetOfToNode.height / 2)) - 100;
        }
        return { "x1": x1, "y1": y1, "x2": x2, "y2": y2 };
    }
    searchDFS() {
        var localAdjList = this.state.adjList;
        var visited = new Array(this.state.vertices.length).fill(false);
        var s = new Stack();
        var startingNode = this.state.vertices[0];
        visited[startingNode] = true;
        s.push(startingNode);
        var TraversingOrder = [];
        var delay = 1;
        while (!s.isEmpty()) {
            delay++;
            var getStackElement = s.pop();
            //this is the current vertex that we wre visiting right now
            TraversingOrder.push(getStackElement);

            console.log(getStackElement);
            var currentNode = document.getElementById(getStackElement);
            currentNode.style.transitionDelay = delay + "s";
            currentNode.style.backgroundColor = "blue";
            //get adjacent list of current element
            var adjListOfCurrentELement = localAdjList.get(getStackElement);
            for (var i in adjListOfCurrentELement) {
                var nextNode = adjListOfCurrentELement[i];
                if (!visited[nextNode]) {
                    visited[nextNode] = true;
                    s.push(nextNode);
                }
            }
        }
        this.setState({
            TraversingOrder: TraversingOrder,
        })
    }

    searchBFS() {
        var localAdjList = this.state.adjList;
        var visited = new Array(this.state.vertices.length).fill(false);
        var q = new Queue();
        var startingNode = this.state.vertices[0];
        visited[startingNode] = true;
        q.enqueue(startingNode);
        var TraversingOrder = [];
        var delay = 1;
        while (!q.isEmpty()) {
            delay++;
            var getQueueElement = q.dequeue();
            //this is the current vertex that we wre visiting right now
            TraversingOrder.push(getQueueElement);

            console.log(getQueueElement);
            var currentNode = document.getElementById(getQueueElement);
            currentNode.style.transitionDelay = delay + "s";
            currentNode.style.backgroundColor = "red";
            //get adjacent list of current element
            var adjListOfCurrentELement = localAdjList.get(getQueueElement);
            for (var i in adjListOfCurrentELement) {
                var nextNode = adjListOfCurrentELement[i];
                if (!visited[nextNode]) {
                    visited[nextNode] = true;
                    q.enqueue(nextNode);
                }
            }
        }
        this.setState({
            TraversingOrder: TraversingOrder,
        })
    }
    clear() {

        this.setState({
            vertices: ["0", "1", "2"],
            verticesToRendor: [["0"], ["1", "2"], []],
            adjList: new Map(),
            showAddEdgePanel: true,
            newEdge: { "to": "0", "from": "1" },
            offSetArray: [],
            TraversingOrder: [],
            currentNodeLevelRendering: 2,
            currentNodeDivsAdded: 0,
            pendingNodesToReachNextLevel: 0,
            nodeStructureArray: [1, 2, 3, 4, 3, 2],
        });

    }

    detechCycle() {
        var localAdjList = this.state.adjList;
        var visited = new Array(this.state.vertices.length).fill(false);
        var s = new Stack();
        var startingNode = this.state.vertices[0];
        visited[startingNode] = true;
        s.push(startingNode);

        var delay = 1;
        while (!s.isEmpty()) {
            delay++;
            var getStackElement = s.pop();
            //this is the current vertex that we wre visiting right now
            var currentNode = document.getElementById(getStackElement);
            currentNode.style.transitionDelay = delay + "s";
            currentNode.style.backgroundColor = "blue";
            //get adjacent list of current element
            var adjListOfCurrentELement = localAdjList.get(getStackElement);
            for (var i in adjListOfCurrentELement) {
                var nextNode = adjListOfCurrentELement[i];
                if (visited[nextNode] && nextNode !== getStackElement) {
                    //cycle detected
                    this.setState({
                        cycleDetected: true
                    });
                    return;
                }
                if (!visited[nextNode]) {
                    visited[nextNode] = true;
                    s.push(nextNode);
                }
            }
        }

    }
    findMotherVertex() {

        //var adjList = this.state.adjList;
        var visited = new Array(this.state.vertices.length).fill(false);
        var nodes = this.state.vertices;
        var lastNode = "";
        for (let i = 0; i < nodes.length; i++) {
            if (!visited[i]) {
                //Run DFS and keep output the last finished vertex
                this.runDFS(i, visited);
                lastNode = nodes[i];
            }
        }
        //now this last node should be part of mother vertex , if there exixtes any mother vertex
        //make visted array as false again
        var newVisited = new Array(this.state.vertices.length).fill(false);
        this.runDFS(lastNode, newVisited);
        var isMotherVertex = true;
        for (let j = 0; j < newVisited.length; j++) {
            if (newVisited[j] === false)
                isMotherVertex = false;
        }
        this.setState({
            isMotherVertex: isMotherVertex
        });

    }
    runDFS(currentNode, visited) {
        visited[currentNode] = true;
        var adjNodes = this.state.adjList.get(currentNode.toString());
        if (adjNodes !== undefined)
            for (let i = 0; i < adjNodes.length; i++) {
                //Run DFS and keep output the last finished vertex
                if (!visited[adjNodes[i]])
                    this.runDFS(adjNodes[i], visited);

            }
    }
    countNodesAtLevel() {
        var levelArray = new Map();
        var adjList = this.state.adjList;
        var vertices = this.state.vertices;
        //apply BFS and update levelArray
        var parentNode = vertices[0];

        //Start BFS from parent node
        var visitedArray = new Array(vertices.length).fill(false);
        var queue = new Queue();
        queue.enqueue(parentNode);
        visitedArray[parentNode] = true;

        while (!queue.isEmpty()) {
            var currentTraversingNode = queue.dequeue();
            console.log(currentTraversingNode);
            if (currentTraversingNode === vertices[0]) levelArray.set(0, [currentTraversingNode]);
            else {
                adjList.forEach((value, key) => {
                    if (value.includes(currentTraversingNode)) {
                        levelArray.forEach((value2, key2) => {
                            if (value2.includes(key)) {
                                //this.getSetLevelArray(levelArray, key2 + 1, currentNode)
                                var level = key2 + 1;
                                if (levelArray.get(level) !== undefined)
                                    levelArray.get(level).push(currentTraversingNode);
                                else
                                    levelArray.set(level, [currentTraversingNode]);
                            }
                        });
                    }
                });
            }

            var adjNodesOfCurrentNode = adjList.get(currentTraversingNode);
            for (var i in adjNodesOfCurrentNode) {
                var currentNode = adjNodesOfCurrentNode[i];
                if (!visitedArray[currentNode]) {
                    queue.enqueue(currentNode);
                    visitedArray[currentNode] = true;

                }

            }
        }
        console.log(levelArray);

    }

    countPathBetweenNodes(event) {
        var newAdjList = new Map(this.state.adjList);
        var vertices = this.state.vertices;
        //now add new edge
        var to = this.state.newEdge.to.toString();
        var from = this.state.newEdge.from.toString();
        //we need to count the number of paths between from and to
        //start DFS from "from" and increment path by one if from node comes
        var totalPaths = 0;
        var visitedNodes = new Array(vertices.length).fill(false);
        var stack = new Stack();
        //to will be the first node to tarverse
        stack.push(from.toString());
        visitedNodes[from] = true;
        while (!stack.isEmpty()) {
            var currentNode = stack.pop();
            var adjList = newAdjList.get(currentNode);
            for (var i in adjList) {
                if (adjList[i] === to) totalPaths = totalPaths + 1;
                else {
                    if (!visitedNodes[adjList[i]]) {
                        stack.push(adjList[i]);
                        visitedNodes[adjList[i]] = true;

                    }
                }
            }
        }
        console.log("Total Paths: " + totalPaths);
    }

    render() {
        var connectingLines = [];
        this.state.offSetArray.forEach((row) => {
            connectingLines.push(<ConnectingLine x1={row.x1} y1={row.y1} x2={row.x2} y2={row.y2}></ConnectingLine>);
        });
        var addNewEdge = <AddEdge to={this.state.newEdge.to}
            from={this.state.newEdge.from}
            handleInputChange={this.handleInputChange}
            saveNewDirectedEdge={this.saveNewDirectedEdge}
            saveNewUnDirectedEdge={this.saveNewUnDirectedEdge}
            countPathBetweenNodes={this.countPathBetweenNodes}></AddEdge>;

        return (

            <div className="content-body">
                {connectingLines}

                <div className="top">
                    <button className="btn" onClick={this.addNewNode}>Add New Node</button>
                    <button className="btn" onClick={this.searchDFS}>DFS</button>
                    <button className="btn" onClick={this.searchBFS}>BFS</button>
                    <button className="btn" onClick={this.detechCycle}>Detect Cycle</button>
                    <button className="btn" onClick={this.findMotherVertex}>Detect Mother Vertex</button>
                    <button className="btn" onClick={this.clear}>Clear</button>
                    <button className="btn" onClick={this.countNodesAtLevel} title="after click check console for details">Count Nodes</button>

                    {this.state.showAddEdgePanel ? addNewEdge : null}
                    {this.state.cycleDetected ? <span>Cycle Detected</span> : null}
                    {this.state.isMotherVertex ? <span>Mother Vertex Detected</span> : <span>No Mother Vertex Detected</span>}
                </div>
                <div className="content">
                    {
                        <div className="node-area">
                            <div className="node-seprator"></div>
                            {
                                this.state.verticesToRendor.map((rows, i) => {
                                    return (
                                        <div className="node-seprator">{
                                            rows.map((cols, j) => {
                                                var className = "node";
                                                return (
                                                    <Node className={className} key={j.toString()} value={cols}></Node>
                                                );
                                            })}
                                        </div>);
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        );

    }
}