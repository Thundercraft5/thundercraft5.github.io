import VectorArray from "../../../node_modules/vector-array/VectorArray.js";

/**
 * @param {Number} time - the time to wait
 * @return {JQuery.Deferred<void>} A promise that with a delay of `time`
 */
function wait(time) {
	return new $.Deferred(def => setTimeout(() => def.resolve(), time));
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const SAMPLE_SIZE = 10;
const MAX_NODES = 50;
const PIXEL_RATIO = (function() {
	const ctx = document.createElement("canvas").getContext("2d"),
		dpr = window.devicePixelRatio || 1,
		bsr = ctx.webkitBackingStorePixelRatio
              || ctx.mozBackingStorePixelRatio
              || ctx.msBackingStorePixelRatio
              || ctx.oBackingStorePixelRatio
              || ctx.backingStorePixelRatio || 1;

	return dpr / bsr;
}());


function createHiDPICanvas(w, h, ratio = undefined, attrs = {}) {
	if (!ratio) ratio = PIXEL_RATIO;
	const can = document.createElement("canvas");

	can.width = w * ratio;
	can.height = h * ratio;
	can.style.width = `${ w }px`;
	can.style.height = `${ h }px`;
	can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);

	return $(can);
}

function addNode(x, y, radius = 5, color = "#000000") {
	canvasContext.fillStyle = "#000000";
	canvasContext.beginPath();
	canvasContext.arc(x, y, radius, 0, 2 * Math.PI, false);
	canvasContext.fill();

	nodes.add(x, y);
}

function drawLine(x1, y1, x2, y2) {
	canvasContext.fillStyle = "#000000";
	canvasContext.beginPath();
	canvasContext.moveTo(x1, y1);
	canvasContext.lineTo(x2, y2);
	canvasContext.stroke();
}

const $canvas = createHiDPICanvas(1000, 1000, undefined, {
	id: "canvasDots-canvas",
});

$canvas.appendTo(".canvasDots-wrapper");

const canvasWidth = $canvas.attr("width");
const canvasHeight = $canvas.attr("height");
const canvasContext = $canvas[0].getContext("2d");
const nodes = new VectorArray();

addNode(getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight), 5, "#aaa");


for (let i = 0; i++ < MAX_NODES;) {
	const index = getRandomInt(0, i);
	const node = nodes[index];
	const nodeDistance = 0;
	let finalCandidate;

	console.log(nodes);

	for (let j = 0; j++ < SAMPLE_SIZE;) {
		const angle = getRandomInt(0, 360);
		const dist = 100;
		const x = dist * Math.sin(angle) + node.x;
		const y = dist * Math.cos(angle) + node.y;
		const candidate = new VectorArray.Entry(x, y);

		if ((x > 0 && x < canvasWidth) && (y > 0 && y < canvasHeight)) // eslint-disable-line
			finalCandidate = candidate;
	}

	drawLine(node.x, node.y, finalCandidate.x, finalCandidate.y);
	addNode(...finalCandidate);

	function distance(a, b) {
		const dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt(dx * dx + dy * dy);
	}
}