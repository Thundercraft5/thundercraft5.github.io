/* eslint-disable prefer-rest-params */
import type { PointLike } from "../../types.ts";
import { TreeException } from "../utils.ts";
import AbstractPoint from "./AbstractPoint.ts";



class AbstractTree {
	static AbstractTree = AbstractTree;
	static AbstractPoint = AbstractPoint;

	nodes: AbstractPoint[] = [];
	maxDepth = Infinity;
	maxChildren = Infinity;
	root: AbstractPoint;
	pointSize = 0;
	x = -1;
	y = -1;
	insertionIndex = 0;

	constructor({
		maxDepth = Infinity,
		maxChildren = Infinity,
		x = 0,
		y = 0,
		root = undefined,
		pointSize = 10,
	} = {}) {
		Object.assign(this, {
			maxDepth,
			pointSize,
			maxChildren,
		});
		this.setRoot(root ?? new AbstractPoint({ tree: this, x, y, isRoot: true }))

	}

	#assertHasRoot() {
		if (!this.root) throw new TreeException("NO_ROOT");

		return this;
	}

	add({
		x = 0,
		y = 0,
		parent = this.root,
		maxDepth = Infinity,
	} = {}): AbstractPoint {
		this.#assertHasRoot();
		const [p] = arguments;

		if (p instanceof AbstractPoint) {
			if (!this.find(p.x, p.y)) this.nodes.push(p);
			if (parent) p.appendTo(parent);
			p.tree = this;

			return p;
		}

		const newPoint = new AbstractPoint({ x, y, parent, tree: this, maxDepth });

		this.nodes.push(newPoint);

		return newPoint;
	}


	remove(point: PointLike): AbstractPoint
	remove(x: number, y: number): AbstractPoint;

	remove(x: number | PointLike = 0, y: number = 0) {
		if (typeof x === "object") return this.remove(x.x, x.y);
		const p = this.find(x, y);
		
		if (!p || p === null) throw new TreeException("NODE_NOT_FOUND", x, y);

		delete p.parent;
		delete p.tree;

		p.depth = -1;
		this.nodes.remove(p);

		return p;
	}

	find(x = 0, y = 0) {
		return this.nodes.find(p => p.x === x && p.y === y);
	}

	setCenter(x = 0, y = 0) {
		this.#assertHasRoot();
		this.root.move(x, y);
		this.x = x;
		this.y = y;

		return this;
	}

	getNodesByDepth() {
		return [...this.nodes].sort((a, b) => {
			if (a.depth < b.depth) return -1;
			else if (a.depth == b.depth) return 0;
			else if (a.depth > b.depth) return 1;
		});
	}

	setRoot({ x, y }: AbstractPoint) {
		if (!arguments[0]) return this;
		// eslint-disable-next-line prefer-destructuring
		this.root = arguments[0];
		this.root.depth = 0;
		this.root.insertionIndex++;
		this.insertionIndex++;
		this.x = x;
		this.y = y;

		return this;
	}

	traverse(traverseFunc: (node: AbstractPoint, tree: AbstractTree) => void) {
		const traverser = (node: AbstractPoint) => {
			if (node.isRoot) {
				traverseFunc(node, this);
				this.root.childNodes.forEach(child => {
					traverseFunc(child, this);
					traverser(child);
				});
			} else if (node.childNodes.length > 0) {
				node.childNodes.forEach(child => traverseFunc(child, this));
				node.childNodes.forEach(child => traverser(child));
			}
		};

		traverser(this.root);

		return this;
	}

	clone(TreeCloner = AbstractTree, PointCloner = AbstractPoint) {
		const newTree = new TreeCloner({ ...this, root: null }),
			recurseTree = (node: AbstractPoint, newParentNode: AbstractPoint) => {
				if (node.isRoot) {
					newTree.setRoot(new PointCloner({
						x: this.root.x,
						y: this.root.y,
						tree: newTree,
						isRoot: true,
						pointSize: this.root.pointSize,
						color: this.root.color,
					}));
					this.root.childNodes.forEach(child => recurseTree(child, newTree.root));
				} else {
					const newNode = new PointCloner({
						x: node.x,
						y: node.y,
						color: node.color,
						pointSize: node.pointSize,
					});

					newParentNode.append(newNode);

					node.childNodes.forEach(child => recurseTree(child, newNode));
				}
			};

		recurseTree(this.root);

		return newTree;
	}

	static deserialize(tree: unknown) {
		Object.setPrototypeOf(tree, this.prototype);
		tree.nodes = [];
		tree.nodes.forEach(p => AbstractPoint.deserialize(p));

		return tree as AbstractTree;
	}
}

export { AbstractPoint, AbstractTree, AbstractTree as default };
