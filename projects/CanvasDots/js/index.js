import { Point, Tree } from "./DotTree/index.js";
import { NullValueException, getRandomInt } from "./utils.js"; // eslint-disable-line

/**
 * @param {Number} time - the time to wait
 * @return {JQuery.Deferred<void>} A promise that with a delay of `time`
 */
function wait(time) {
	return new $.Deferred(def => setTimeout(() => def.resolve(), time));
}

function getOptions() {
	const r = {};

	for (const [name, node] of Object.entries(CONTROLS_MAP)) {
		const $node = $(node);

		switch ($node.attr("type")) {
			case "range": r[name] = +$(node).val(); break;
			case "checkbox": r[name] = $(node).prop("checked"); break;
		}
	}

	return r;
}

const treeWorker = new Worker("./js/Workers/TreeHandler.js");

treeWorker.addEventListener("message", console.log);

const DEFAULT_OPTIONS = {
	SAMPLE_SIZE: 10,
	MAX_NODES: 1000,
	MAX_DIST: 200,
	MIN_DIST: 10,
	MAX_CHILDREN: 10,
	MAX_DEPTH: 10,
	SHOW_LINES: false,
	SHOW_COLORS: false,
};
const CONTROLS_MAP = {
	SAMPLE_SIZE: "#sampleSize",
	MAX_NODES: "#maxNodes",
	MAX_DIST: "#maxDist",
	MIN_DIST: "#minDist",
	MAX_CHILDREN: "#maxChildren",
	MAX_DEPTH: "#maxDepth",
	SHOW_LINES: "#showLines",
	SHOW_COLORS: "#showColors",
};

for (const [key, node] of Object.entries(CONTROLS_MAP))
	$(node).val(DEFAULT_OPTIONS[key]);

function run({
	SAMPLE_SIZE = 10,
	MAX_NODES = 1000,
	MAX_DIST = 200,
	MIN_DIST = 10,
	MAX_CHILDREN = 10,
	MAX_DEPTH = 10,
	SHOW_LINES = false,
	SHOW_COLORS = false,
} = {}) {
	$(".canvasDots-wrapper").empty();

	const $container = $(".canvasDots-wrapper");
	const tree = new Tree({
		pointSize: 5,
		maxChildren: MAX_CHILDREN,
		maxDepth: MAX_DEPTH,
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

	outer: for (let i = 0; i++ < MAX_NODES;) {
		const donePercentage = ((i + MAX_NODES)/MAX_NODES - 1) * 100;
		const candidates = [];

		for (let j = 0; j++ < SAMPLE_SIZE;) {
			const angle = getRandomInt(0, 360);
			const index = getRandomInt(0, tree.nodes.length-1);
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

			if (!closest.childrenAmountInBounds || !closest.depthInBounds) continue outer;
			if (!node) throw new NullValueException("Node not found");

			if (closest) candidates.push({
				closest,
				node: candidate,
			});
			else throw new NullValueException(`Closest node not found: index ${ index }, node number ${ i }, candidate number: ${ j }`);
		}

		const { closest: parent, node } = candidates.greatest((prev, cur) => distance(prev.closest, prev.node) <= distance(cur.closest, cur.node)); // eslint-disable-line

		node.appendTo(parent);

		if (SHOW_COLORS) {
			const color = `#${ (parent.depth * 1000).toString(16).split(".")[0].padEnd(6, "0") }`;

			node.draw(color);
		} else node.draw();

		if (SHOW_LINES) canvas.fillLine(parent.x, parent.y, node.x, node.y);
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
}

/** @this HTMLInputElement */
function updateRanges() {
	$(this).siblings(".value").text(this.value);
}

run(DEFAULT_OPTIONS);
$(".canvasDots-reset").on("click", () => run(getOptions()));
$(".canvasDots-controls input").each(updateRanges).on("input", updateRanges);