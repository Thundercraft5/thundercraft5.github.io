/**
 * @typedef {import(".").Tree} Tree
 * @typedef {import(".").Point} Point
 * @typedef {import(".").Canvas} Canvas
 */

export default class Point {
	x = NaN;
	y = NaN;
	color = "#000000";
	/** @type {Canvas} */
	canvas = null;
	/** @type {Point} */
	parent = null;
	/** @type {Tree} */
	tree = null;
	childNodes = [];
	depth = -1;

	/**
	 * @param {{
	 *	x?: number,
	 *	y?: number,
	 *	color?: string,
	 *	parent?: Point,
	 *	tree?: Tree,
	 * }}
	 */
	constructor({
		x = 0,
		y = 0,
		color = "#000000",
		parent = null,
		tree = null,
	} = {}) {
		Object.assign(this, {
			x,
			y,
			color,
			parent,
			tree,
		});
		this.depth = this.parent ? this.parent.depth + 1 : 0;

		if (this.parent)
			this.parent.appendChild(this);

		if (this.tree) {
			this.setTree(tree);
			this.addToTreeNodes();
		}
	}

	createChild({ x = 0, y = 0, color = "#000000" } = {}) {
		const p = new Point({ x, y, color, parent: this, tree: this.tree });

		this.childNodes.push(p);

		return p;
	}

	removeChild(x = 0, y = 0) {
		if (typeof x === "object") return this.removeChild(x.x, x.y);

		return this.childNodes.find(p => p.x === x && p.y === y)?.remove();
	}

	remove() {
		this.childNodes.forEach(p => p.remove());
		this.parent.childNodes.remove(this);
		this.tree.nodes.remove(this);

		this.parent = null;
		this.depth = -1;
		this.tree = null;

		return this;
	}

	/**
	 * @param {Point} parent
	 */
	appendTo(parent = null) {
		parent.appendChild(this);

		return this;
	}

	/**
	 * @param {Point} point
	 */
	appendChild(point = null) {
		this.childNodes.push(point);
		point.parent = this;
		point.tree = point.parent.tree;
		point.depth = point.parent.depth + 1;

		return this;
	}

	/**
	 * @param {Tree} tree
	 */
	setTree(tree = null) {
		this.tree = tree;

		return this;
	}

	addToTreeNodes() {
		this.tree.nodes.push(this);

		return this;
	}

	hasChildren() {
		return !!this.childNodes.length;
	}

	draw(color = "#000", pointSize = this.tree.pointSize) {
		this.canvas.fillCircle(color, this.x, this.y, pointSize);

		return this;
	}
}