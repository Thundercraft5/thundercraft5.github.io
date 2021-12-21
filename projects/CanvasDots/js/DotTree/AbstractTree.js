import AbstractPoint from "./AbstractPoint.js";
import Tree from "./index.js";

class AbstractTree {
	static AbstractTree = AbstractTree;
	static AbstractPoint = AbstractPoint;

	/** @type {AbstractPoint[]}*/
	nodes = [];
	maxDepth = Infinity;
	maxChildren = Infinity;
	/** @type {AbstractPoint} */
	root = null;
	size = 10;
	pointSize = 0;
	x = -1;
	y = -1;

	constructor({
		maxDepth = Infinity,
		maxChildren = Infinity,
		x = 0,
		y = 0,
		root = new AbstractPoint({ tree: this, x, y }),
		pointSize = 10,
	} = {}) {
		Object.assign(this, {
			maxDepth,
			root,
			pointSize,
			maxChildren,
		});
		this.root.depth = 0;
		this.x = root.x;
		this.y = root.y;
	}

	/** @returns {AbstractPoint}*/
	add({
		x = 0,
		y = 0,
		parent = this.root,
		maxDepth = Infinity,
	} = {}) {
		const [p] = arguments; // eslint-disable-line

		if (p instanceof Point) {
			if (!this.find(p.x, p.y)) this.nodes.push(p);
			if (parent) p.appendTo(parent);
			p.tree = this;

			return p;
		}
		const newPoint = new Point({ x, y, parent, tree: this, maxDepth });

		this.nodes.push(newPoint);

		return newPoint;
	}


	remove(x = 0, y = 0) {
		if (typeof x === "object") return this.remove(x.x, x.y);
		const p = this.find(x, y);

		p.parent = null;
		p.tree = null;
		p.depth = -1;
		this.nodes.remove(p);

		return p;
	}

	find(x = 0, y = 0) {
		return this.nodes.find(p => p.x === x && p.y === y);
	}

	setCenter(x = this.canvas.width / 2, y = this.canvas.height / 2) {
		this.root.move(x, y);
		this.x = x;
		this.y = y;

		return this;
	}
}

export { AbstractTree, AbstractPoint };
export default AbstractTree;