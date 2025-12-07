import {
	DuplicateNodeException,
	NodeDepthOutOfBoundsException,
	TooManyChildNodesException,
	getRandomInt,
} from "../utils.js";

/**
 * @typedef {import("./index.js").AbstractTree} AbstractTree
 */

export default class AbstractPoint {
	x = NaN;
	y = NaN;
	/** @type {AbstractPoint} */
	parent = null;
	/** @type {AbstractTree} */
	tree = null;
	/** @type {AbstractPoint[]} */
	childNodes = [];
	/** @type {AbstractPoint[]} */
	siblings = [];
	depth = -1;
	pointSize = 0;
	id = getRandomInt(0, 10_000_000_000_000_000_000_000);
	maxDepth = Infinity;
	maxChildren = Infinity;
	isRoot = false;
	insertionIndex = -1;

	get canAddChildNodes() {
		return this.childrenAmountInBounds && this.depthInBounds;
	}

	get depthInBounds() {
		return this.depth + 1 <= this.tree.maxDepth;
	}

	get childrenAmountInBounds() {
		const nextAmount = this.childNodes.length + 1;

		return nextAmount <= this.maxChildren && nextAmount <= this.tree.maxChildren;
	}

	/**
	 * @param {{
	 *	x?: number,
	 *	y?: number,
	 *	color?: string,
	 *	parent?: AbstractPoint,
	 *	tree?: Tree,
	 *  pointSize?: number,
	 *  maxChildren?: number,
	 * }}
	 */
	constructor({
		x = 0,
		y = 0,
		parent = null,
		tree = null,
		pointSize = 0,
		maxChildren = Infinity,
		isRoot = false,
		insertionIndex = -1,
	} = {}) {
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

	createChild({ x = 0, y = 0 } = {}) {
		const p = new AbstractPoint({ x, y, parent: this, tree: this.tree });

		this.childNodes.push(p);

		return p;
	}

	removeChild(x = 0, y = 0) {
		if (typeof x === "object") return this.removeChild(x.x, x.y);

		return this.childNodes.find(p => p.x === x && p.y === y)?.remove();
	}

	remove() {
		this.childNodes.forEach(p => p.remove());
		this.siblings.forEach(p => p.siblings.remove(this));
		this.parent.childNodes.remove(this);
		this.tree.nodes.remove(this);

		this.parent = null;
		this.depth = -1;
		this.tree = null;
		this.insertionIndex = -1;
		this.siblings = [];
		this.isRoot = false;

		return this;
	}

	/**
	 * @param {AbstractPoint} parent
	 */
	appendTo(parent = null) {
		parent.append(this);

		return this;
	}

	/**
	 * @param {AbstractPoint} point
	 * @throws {DepthOutOfRangeException}
	 * @throws {TooManyChildNodesException}
	 */
	append(point) {
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

	/**
	 * @param {AbstractTree} tree
	 */
	setTree(tree) {
		this.tree = tree;
		this.pointSize ||= this.tree.pointSize;
		this.addToTree();

		return this;
	}

	addToTree() {
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

	static deserialize(point) {
		Object.setPrototypeOf(point, this.prototype);

		return point;
	}
}