export class Node<T> {
    data: T;
    adjacent: Node<T>[];
    comparator: (a: T, b: T) => number;

    constructor(data: T, comparator: (a: T, b: T) => number) {
        this.data = data;
        this.adjacent = [];
        this.comparator = comparator;
    }

    addAdjacent(node: Node<T>): void {
        this.adjacent.push(node);
    }

    removeAdjacent(data: T): Node<T> | null {
        const index = this.adjacent.findIndex((node) => this.comparator(node.data, data) === 0);

        if (index > -1) {
            return this.adjacent.splice(index, 1)[0];
        }

        return null;
    }
}

export class UniverseGraph<T> {
    nodes: Map<T, Node<T>> = new Map();
    comparator: (a: T, b: T) => number;

    constructor(comparator: (a: T, b: T) => number) {
        this.comparator = comparator;
    }

    addNode(data: T): Node<T> {
        let node = this.nodes.get(data);
        if (node) return node;
        node = new Node(data, this.comparator);
        this.nodes.set(data, node);
        return node;
    }

    removeNode(data: T): Node<T> | null {
        let nodeToRemove = this.nodes.get(data);

        if (!nodeToRemove) return null;

        this.nodes.forEach((node) => {
            // @ts-ignore
            node.removeAdjacent(nodeToRemove.data);
        });

        this.nodes.delete(data);
        return nodeToRemove;

    }
}
