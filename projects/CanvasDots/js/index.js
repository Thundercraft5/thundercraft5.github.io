/* eslint-disable unicorn/prefer-top-level-await */
import { AbstractPoint, AbstractTree, Point, Tree } from "./DotTree/index.js";
import { NullValueException, distance, drawOutArray, getRandomInt } from "./utils.js";
import { TreeWorker } from "./Workers/index.js";
import $ from "../../../node_modules/jquery/dist/jquery.js";

/**
 * @param {Number} time - the time to wait for
 * @returns {JQuery.Deferred<void>} A promise with a delay of {@link time}
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

const treeWorker = new TreeWorker();
const DEFAULT_OPTIONS = {
	SAMPLE_SIZE: 10,
	MAX_NODES: 300,
	MAX_DIST: 200,
	MIN_DIST: 10,
	MAX_CHILDREN: 10,
	MAX_DEPTH: 10,
	SHOW_LINES: true,
	SHOW_COLORS: true,
};
const CONSTANTS = {
	MARGIN: 10,
	POINT_SIZE: 5,
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

async function run({
	SAMPLE_SIZE = 10,
	MAX_NODES = 300,
	MAX_DIST = 200,
	MIN_DIST = 10,
	MAX_CHILDREN = 10,
	MAX_DEPTH = 10,
	SHOW_LINES = true,
	SHOW_COLORS = true,
} = {}, $reset, $input) {
	$reset.text("Running...");

	$(".canvasDots-wrapper").empty();
	const $container = $(".canvasDots-wrapper");
	const canvasHeight = 1000 + $container.height(),
		canvasWidth = $container.width();
	const tree = await treeWorker.send("process", {
		canvasHeight,
		canvasWidth,
		SAMPLE_SIZE,
		MAX_NODES,
		MAX_DIST,
		MIN_DIST,
		MAX_CHILDREN,
		MAX_DEPTH,
		CONSTANTS,
	}).then(([ t ]) => {
		$reset.text("Re-run");

		return Tree.fromAbstract(AbstractTree.deserialize(t), {
			height: canvasHeight,
			width: canvasWidth,
			selector: ".canvasDots-wrapper",
			attrs: {
				id: "canvasDots-canvas",
			},
		});
	});

	tree.setCenter();

	const { canvas } = tree;

	tree.setCenter();
	tree.root.draw("#000000", 10);

	tree.traverse(node => {
		if (!node.parent) return;
		const { parent } = node;

		if (SHOW_COLORS) {
			const color = `#${ (parent.depth * 1000).toString(16).split(".")[0].padEnd(6, "0") }`;

			node.draw(color);
		} else node.draw();

		if (SHOW_LINES) canvas.fillLine(parent.x, parent.y, node.x, node.y);
		parent.redraw();
	});

	Object.assign(window, {
		canvas, tree,
		distance,
		run,
		treeWorker,
	});
}

/** @this HTMLInputElement */
function updateRanges() {
	$(this).siblings(".value").text(this.value);
}

const $inputs = $(".canvasDots-controls"),
	$reset = $(".canvasDots-reset");

run(DEFAULT_OPTIONS, $reset, $inputs);

$reset.on("click", e => {
	run(getOptions(), $reset, $inputs);
});
$(".canvasDots-controls input").each(updateRanges).on("input", updateRanges);