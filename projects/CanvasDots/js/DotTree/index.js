import AbstractTree from "./AbstractTree.js"; // eslint-disable-line
import AbstractPoint from "./AbstractPoint.js"; // eslint-disable-line
import Canvas from "./Canvas.js";
import Point from "./Point.js";

class Tree extends AbstractTree {
	static Canvas = Canvas;
	static Tree = Tree;
	static Point = Point;

	/** @type {Canvas} */
	canvas = null;
	/** @type {Point[]} */
	nodes = [];
	#_;

	constructor({
		canvas = null,
		maxDepth = Infinity,
		maxChildren = Infinity,
		x = 0,
		y = 0,
		root = new Point({ x, y }),
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
		root.setTree(this);
		console.log(root.canvas);
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
		console.log(this.canvas);

		return this.canvas;
	}

	toAbstract() {
		return new AbstractTree(this);
	}


	static fromAbstract(abstractTree, {
		height = 1000,
		width = 1000,
		attrs = {},
		selector = "body",
	} = { _empty: true }) {
		const tree = new this(abstractTree);

		if (!arguments[1]._empty) tree.attachCanvas({ height, width, attrs, selector }); // eslint-disable-line

		return tree;
	}
}
export { Tree, Point, Canvas, AbstractTree, AbstractPoint };
export default Tree;