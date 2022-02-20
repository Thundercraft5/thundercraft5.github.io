import { distance } from "./utils.js";
import Canvas from "./Canvas.js";
import * as math from "https://esm.sh/mathjs";

function getPointAt({ x, y }) {
	x = x*scaling+scaledDist;
	y = y*scaling+scaledDist;

	return { x, y };
}

const func = "y = x^2";
const expr = math.parse(func).compile();
// NB: Goes in all 4 directions
const maxDist = 100;
const stepSize = 0.1;
const xThreshold = 0.1;
const plots = [];
const canvasSize = $(".minMaxFinder-canvas-wrapper").width();
const canvas = new Canvas({
	width: canvasSize,
	height: canvasSize,
});
const scaling = canvasSize / maxDist;
const scaledDist = scaling*maxDist/2;

canvas.attach(".minMaxFinder-canvas-wrapper");
// X Axis
canvas.fillLine(-maxDist*scaling, scaledDist, maxDist*scaling, scaledDist, "#000", 2);
// Y Axis
canvas.fillLine(scaledDist, -maxDist*scaling, scaledDist, maxDist*scaling, "#000", 2);

console.log(getPointAt({ x: 5, y: 5 }));

// Plot function
for (let x = -maxDist, i = 0; x < maxDist; x += stepSize, i++) {
	const y = expr.evaluate({ x });

	plots.push({ x, y });
	if (plots[i-1] && Math.floor(y) <= maxDist) {
		const { x: lastX, y: lastY } = getPointAt(plots[i-1]);

		canvas.fillLine(lastX, lastY, x, y, "#000");
	}
}

let lastPlot = plots[0];
let min;

canvas.attach(".minMaxFinder-canvas-wrapper");

for (const [i, { x, y }] of plots.slice(1).entries()) {
	const { x: lastX, y: lastY } = lastPlot;

	if (Math.abs(math.abs(y)-math.abs(lastY)) < xThreshold) {
		min = { x, y };
		break;
	}
	lastPlot = plots[i];
}

console.log(min);