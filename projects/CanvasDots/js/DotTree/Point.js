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
		isRoot = false,
		insertionIndex = -1,
	} = {}) {
		super({
			parent,
			tree,
			x,
			y,
			pointSize,
			maxChildren,
			isRoot,
			insertionIndex,
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

	append(node) {
		super.append(node);
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

	redraw() {
		this.canvas.fillCircle(this.color, this.x, this.y, this.pointSize);

		return this;
	}


	setCanvas(canvas) {
		if (canvas) this.canvas = canvas;

		return this;
	}

	toAbstract() {
		return new AbstractPoint(this);
	}
}