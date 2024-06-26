import { TSMap } from "typescript-map";
import { CBProps, CBType } from "../interfaces";
import { Star } from "./Star";

// Graph:
//      Undirected collection of root nodes
// Root nodes:
//      Trees which contain their own data and child nodes
//      Has adjacent root nodes
// Nodes:
//      May have children
//      No adjacent nodes
//
// Key points:
//      1. If a root node is removed, children are elevated to root nodes and inherit adjacent nodes
//      2. Position of Nodes is relative to the related root node
//      3. Children are not included in the graph list
//
// Considering MongoDB as we build this class:
//
// https://www.mongodb.com/databases/mongodb-graph-database
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/?_ga=2.209911061.143376147.1709184627-1167249664.1709094178
// 

export enum Collection {
    Stars = "stars",
    CelestialBodies = "celestial_bodies",
}

// KEY POINTS TO CONSIDER
//      1. data will be of type any on the frontend, but removed on the backend
//      2. parentId and collection denotes the location of 'data' in MongoDB
export interface INode {
    data: any;
    parentId: any;
    name: string;
    // type: CBType;
    collection: Collection;
    description: string;
    adjacent: Node<Star>[];
    children: CBProps[];
    // comparator: (a: Star, b: Star) => number;
}

export class Node<T> {
    data: T;
    parentId: string;
    name: string;
    collection: Collection;
    description: string;
    adjacent: Node<T>[];
    children: CBProps[];
    // comparator: (a: T, b: T) => number;

    constructor(data: T, parentId: string, name: string, description: string, collection: Collection) {
        this.data = data;
        this.parentId = parentId;
        this.name = name;
        this.description = description;
        this.collection = collection;
        this.adjacent = [];
        this.children = [];
        // this.comparator = comparator;
    }

    addAdjacent(node: Node<T>): void {
        this.adjacent.push(node);
    }

    removeAdjacent(data: T): Node<T> | null {
        // const index = this.adjacent.findIndex((node) => this.comparator(node.data, data) === 0);

        // if (index > -1) {
        //     return this.adjacent.splice(index, 1)[0];
        // }

        return null;
    }
}

export class UniverseGraph<T> {
    nodes: TSMap<string, Node<T>> = new TSMap();
    comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    addNode(key: string, data: T, parentId: string, name: string, description: string, collection: Collection): Node<T> {
        let node = this.nodes.get(key);
        // if (node) return node;
        // node = new Node(data, parentId, name, description, collection, this.comparator);
        // this.nodes.set(key, node);
        return node;
    }

    removeNode(key: string): Node<T> | null {
        let nodeToRemove = this.nodes.get(key);

        if (!nodeToRemove) return null;

        // 
        this.nodes.forEach((node) => {
            // @ts-ignore
            node.removeAdjacent(nodeToRemove.data);
        });

        this.nodes.delete(key);
        return nodeToRemove;

    }

    getNodeByKey(key: string): Node<T> | null {
        const node = this.nodes.get(key);
        if (!node) return null;
        return node;
    }
}
