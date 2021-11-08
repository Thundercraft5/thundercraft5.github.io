import "../../../../js/extensions.js";
import Canvas from "./Canvas.js";
import Point from "./Point.js";

class Tree {
	static Tree = Tree;
	static Point = Point;
	static Canvas = Canvas;

	nodes = [];
	canvas = null;
	maxDepth = Infinity;
	root = null;
	size = 10;
	pointSize = 0;

	constructor({
		canvas = null,
		maxDepth = Infinity,
		root = new Point({ tree: this }),
		pointSize = 10,
	} = {}) {
		Object.assign(this, {
			maxDepth,
			canvas,
			root,
			pointSize,
		});
		this.root.depth = 0;
	}

	add({ x = 0, y = 0, color = "#000000", parent = this.root } = {}) {
		const [p] = arguments; // eslint-disable-line

		if (p instanceof Point) {
			if (!this.find(p.x, p.y)) this.nodes.push(p);
			if (parent) p.appendTo(parent);
			p.tree = this;

			return p;
		}
		const newPoint = new Point({ x, y, color, parent, tree: this });

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

	attachCanvas({
		height = 1000,
		width = 1000,
		attrs = {},
		selector = "body",
	} = {}) {
		return this.canvas = new Canvas({ height, width, attrs }).attach(selector);
	}
}
const t = new Tree();

console.log(t.add({
	x: 5, y: 5,
}).createChild({
	x: -5, y: -5,
}).remove(new Point({ x: 5, y: 5 })).appendTo(t.nodes[0]));

export { Tree, Point, Canvas };
export default Tree;