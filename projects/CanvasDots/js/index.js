import { Point, Tree } from "./DotTree/index.js";
import { NullValueException, getRandomInt } from "./utils.js";

/**
 * @param {Number} time - the time to wait
 * @return {JQuery.Deferred<void>} A promise that with a delay of `time`
 */
function wait(time) {
	return new $.Deferred(def => setTimeout(() => def.resolve(), time));
}

const $container = $(".canvasDots-wrapper");
const SAMPLE_SIZE = 10;
const MAX_NODES = 1000;
const MAX_DIST = 200;
const MIN_DIST = 10;
const tree = new Tree({
	pointSize: 5,
});
const canvas = tree.attachCanvas({
	height: 1000 + $container.height(),
	width: $container.width(),
	selector: ".canvasDots-wrapper",
	attrs: {
		id: "canvasDots-canvas",
	},
});

tree.setCenter();

tree.root.draw("#000000", 10);

for (let i = 0; i++ < MAX_NODES;) {
	const donePercentage = ((i + MAX_NODES)/MAX_NODES - 1) * 100;
	const candidates = [];

	for (let j = 0; j++ < SAMPLE_SIZE;) {
		const angle = getRandomInt(0, 360);
		const index = getRandomInt(0, i-2);
		const node = tree.nodes[index];
		const dist = getRandomInt(MIN_DIST, MAX_DIST);
		const x = Math.clamp(dist * Math.sin(angle) + node.x, 0, canvas.width);
		const y = Math.clamp(dist * Math.cos(angle) + node.y, 0, canvas.height);
		const candidate = new Point({ x, y });
		let closest;

		if (tree.nodes.length > 2)
			closest = tree.nodes.greatest((prev, cur) => distance(prev, candidate) >= distance(cur, candidate));
		else if (tree.nodes[1] && distance(tree.nodes[1], candidate) > distance(tree.nodes[0], candidate))
			[, closest] = tree.nodes;
		else
			[closest] = tree.nodes;

		if (!node) throw new NullValueException("Node not found");

		if (closest) candidates.push({ closest, node: candidate });
		else throw new NullValueException(`Closest node not found: index ${ index }, node number ${ i }, candidate number: ${ j }`);
	}

	const { closest: parent, node } = candidates.greatest((prev, cur) => distance(prev.closest, prev.node) <= distance(cur.closest, cur.node)); // eslint-disable-line
	// const color = `#${ (parent.depth * 1000).toString(16).split(".")[0].padEnd(6, "0") }`;
	let color;


	// canvas.fillLine(parent.x, parent.y, node.x, node.y);
	node.appendTo(parent);
	node.draw(color);
	parent.redraw();
}

function distance(a, b) {
	const dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt(dx**2 + dy**2);
}

Object.assign(window, {
	canvas, tree,
});