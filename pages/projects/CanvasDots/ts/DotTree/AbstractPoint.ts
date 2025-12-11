import type { PointLike } from "../../types.ts";
import {
	DuplicateNodeException,
	NodeDepthOutOfBoundsException,
	TooManyChildNodesException,
	TreeException,
	getRandomInt,
} from "../utils.ts";
import type { AbstractTree } from "./AbstractTree.ts";

import "native-extensions"

export default class AbstractPoint {
	x = NaN;
	y = NaN;
	parent?: AbstractPoint;
	tree?: AbstractTree;
	childNodes: AbstractPoint[] = [];
	siblings: AbstractPoint[] = [];
	depth: number = -1;
	pointSize: number = 0;
	id = getRandomInt(0, 10_000_000_000_000_000_000_000);
	maxDepth = Infinity;
	maxChildren = Infinity;
	isRoot = false;
	insertionIndex = -1;

	get canAddChildNodes() {
		return this.childrenAmountInBounds && this.depthInBounds;
	}

	get depthInBounds() {
		if (!this.tree) throw new TreeException("NO_ROOT");
		return this.depth + 1 <= this.tree.maxDepth;
	}

	get childrenAmountInBounds() {
		if (!this.tree) throw new TreeException("NO_ROOT");

		const nextAmount = this.childNodes.length + 1;

		return nextAmount <= this.maxChildren && nextAmount <= this.tree.maxChildren;
	}

	#assertHasTree() {
		if (!this.tree) throw new TreeException("NO_TREE");
	}

	constructor({
		x = 0,
		y = 0,
		parent,
		tree,
		pointSize = 0,
		maxChildren = Infinity,
		isRoot = false,
		insertionIndex = -1,
	}: {
		x?: number,
		y?: number,
		color?: string,
		parent?: AbstractPoint,
		tree?: AbstractTree,
		pointSize?: number,
		maxChildren?: number,
		isRoot?: boolean,
		insertionIndex?: number;
	} = {} as any) {
		Object.assign(this, {
			x,
			y,
			parent,
			tree,
			pointSize,
			maxChildren,
			isRoot,
			insertionIndex,
		});
		this.depth = this.parent ? this.parent.depth + 1 : 0;

		if (this.parent) this.parent.append(this);

		if (tree) this.setTree(tree);
	}

	createChild({ x = 0, y = 0 }: Point = {} as any) {
	const p = new AbstractPoint({ x, y, parent: this, tree: this.tree });

	this.childNodes.push(p);

	return p;
}

	removeChild(x: number, y: number): AbstractPoint | undefined;
	removeChild(point: PointLike | number, y?: number) {
		if (typeof point === "object") return this.removeChild(point.x, point.y);

		return this.childNodes.find(p => p.x === point.x && p.y === point.y)?.remove();
	}

	remove() {
		this.childNodes.forEach(p => p.remove());
		this.siblings.forEach(p => p.siblings.filter(a => a !== this));
		this.parent.childNodes.filter(a => a !== this);
		this.tree.nodes.filter(a => a !== this);

		this.parent = undefined;
		this.depth = -1;
		this.tree = undefined;
		this.insertionIndex = -1;
		this.siblings = [];
		this.isRoot = false;

		return this;
	}

	appendTo(parent: AbstractPoint) {
		parent.append(this);

		return this;
	}


	append(point: AbstractPoint) {
		if (!this.depthInBounds) throw new NodeDepthOutOfBoundsException(this);
		else if (!this.childrenAmountInBounds) throw new TooManyChildNodesException(point, this);

		if (this.childNodes.includes(point) || this.childNodes.findIndex(c => c.x === point.x && c.y === point.y) != -1) throw new DuplicateNodeException(this);
		this.childNodes.push(point);

		point.parent = this;
		point.setTree(this.tree);
		point.depth = point.parent.depth + 1;
		point.insertionIndex = this.tree.insertionIndex++;
		this.childNodes.forEach(c => {
			c.siblings.replaceWith([...this.childNodes].removeFrom(c));
		});


		return this;
	}


	setTree(tree: AbstractTree) {
		this.tree = tree;
		this.pointSize ||= this.tree.pointSize;
		this.addToTree();

		return this;
	}

	addToTree() {
		this.#assertHasTree();
		if (!this.tree.nodes) console.log(this.tree)
		this.tree.nodes.push(this);

		return this;
	}

	hasChildren() {
		return this.childNodes.length > 0;
	}

	move(x = 0, y = 0) {
		this.x = x;
		this.y = y;

		return this;
	}

	clone() {
		return new AbstractPoint({ ...this, tree: null, insertionIndex: -1, parent: null });
	}

	static deserialize(point: unknown) {
		Object.setPrototypeOf(point, this.prototype);

		return point as AbstractPoint;
	}
}