import AbstractPoint from "./AbstractPoint.js";

/**
 * @typedef {import(".").Tree} Tree
 * @typedef {import(".").Point} Point
 * @typedef {import(".").Canvas} Canvas
 */

export default class Point extends AbstractPoint {
	color = "#000000";
	/** @type {Canvas} */
	canvas = null;

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
	 *	parent?: Point,
	 *	tree?: Tree,
	 *  pointSize?: number,
	 *  maxDepth?: number,
	 * }}
	 */
	constructor({
		x = 0,
		y = 0,
		color = "#000000",
		parent = null,
		tree = null,
		pointSize = 0,
		maxChildren = Infinity,
	} = {}) {
		super({
			parent,
			tree,
			x,
			y,
			pointSize,
			maxChildren,
		});
		this.setColor(color);
		if (tree) this.setCanvas(tree.canvas);
	}

	draw(color = "#000", pointSize = this.tree.pointSize) {
		this.canvas.fillCircle(color, this.x, this.y, pointSize);
		this.color = color;
		this.pointSize = pointSize;

		return this;
	}

	appendChild(node) {
		super.appendChild(node);
		node.setCanvas(this.canvas);
	}

	setTree(tree) {
		super.setTree(tree);
		if (tree.canvas) this.setCanvas(tree.canvas);

		return this;
	}

	setColor(color) {
		this.color = color;

		return this;
	}

	setCanvas(canvas) {
		console.log(canvas);
		if (canvas) this.canvas = canvas;

		return this;
	}

	toAbstract() {
		return new AbstractPoint(this);
	}
}