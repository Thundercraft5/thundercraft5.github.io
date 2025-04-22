import AbstractTree from "./AbstractTree.js";
import AbstractPoint from "./AbstractPoint.js"; // eslint-disable-line
import Canvas from "./canvas.js";
import Point from "./Point.js";

class Tree extends AbstractTree {
	static Canvas = Canvas;
	static Tree = Tree;
	static Point = Point;

	/** @type {Canvas} */
	canvas = null;
	/** @type {Point[]} */
	nodes = [];
	static {}
	constructor({
		canvas = null,
		maxDepth = Infinity,
		maxChildren = Infinity,
		x = 0,
		y = 0,
		root = new Point({ x, y, isRoot: true }),
		pointSize = 10,
	} = {}) {
		super({
			maxDepth,
			maxChildren,
			x,
			y,
			root,
			pointSize,
		});
		Object.assign(this, {
			canvas,
		});
		root?.setTree(this);
	}

	add({
		x = 0,
		y = 0,
		color = "#000000",
		parent = this.root,
		maxDepth = Infinity,
	} = {}) {
		const [p] = arguments; // eslint-disable-line

		if (p instanceof AbstractPoint) return super.add.apply(this, [ p ]);
		/** @type {Point} */
		const newPoint = super.add({
			x, y, parent, maxDepth,
		});

		newPoint.setColor(color);
		newPoint.setCanvas(this.canvas);

		return newPoint;
	}

	attachCanvas({
		height = 1000,
		width = 1000,
		attrs = {},
		selector = "body",
	} = {}) {
		this.canvas = new Canvas({ height, width, attrs }).attach(selector);
		this.nodes.forEach(node => node.setCanvas(this.canvas));

		return this.canvas;
	}

	toAbstract() {
		return new AbstractTree(this);
	}

	setCenter(x = this.canvas.width / 2, y = this.canvas.height/ 2) {
		return super.setCenter(x, y);
	}

	static fromAbstract(/** @type {AbstractTree} */ abstractTree, {
		height = 1000,
		width = 1000,
		attrs = {},
		selector = "body",
	} = { _empty: true }) {
		const tree = abstractTree.clone(this, Point);

		if (!arguments[1]?._empty) tree.attachCanvas({ height, width, attrs, selector }); // eslint-disable-line

		return tree;
	}
}
export { Tree, Point, Canvas, AbstractTree, AbstractPoint };
export { Tree as _ };
export default Tree;