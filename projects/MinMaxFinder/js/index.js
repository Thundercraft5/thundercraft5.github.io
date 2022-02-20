import { distance, shiftToPositive } from "./utils.js";
import Canvas from "./Graph/Canvas.js";
import * as math from "./dist/math.js";

console.log(math);

function getPointAt({ x, y }) {
	x = x*scaling+halfScaledDist;
	y = -y*scaling+halfScaledDist;

	return { x, y };
}

function plotFunction(func, targetVariable = "x", color = "#f00", includeDerivative = false) {
	const expr = math.parse(func);
	const compiledExpr = expr.compile();
	const plots = [];

	console.log(func);

	// Plot function
	for (let input = -maxDist, i = 0; input < maxDist; input += stepSize, i++) {
		let x = input;
		let y = compiledExpr.evaluate({ [targetVariable]: x });

		plots.push({ x, y });
		if (plots[i-1] && Math.floor(y) <= maxDist) {
			const { x: lastX, y: lastY } = getPointAt(plots[i-1]);

			({ x, y } = getPointAt({ x, y }));

			canvas.fillLine(lastX, lastY, x, y, color, 3);
		}
	}

	if (includeDerivative) {
		const derivativePlots = plotFunction(math.derivative(expr.value, targetVariable).toString(), targetVariable, "blue", false);

		return {
			plots,
			derivative: derivativePlots,
		};
	}

	return plots;
}

const func = "y = x^2";
// NB: Goes in all 4 directions
const maxDist = 100;
const divisions = 100;
const stepSize = 0.1;
const graphDivisionDist = maxDist/divisions;
const xThreshold = 0.1;
const canvasSize = $(".minMaxFinder-canvas-wrapper").width();
const canvas = new Canvas({
	width: canvasSize,
	height: canvasSize,
});
const scaling = canvasSize / maxDist;
const scaledDist = scaling*maxDist;
const halfScaledDist = scaledDist/2;

console.log(scaledDist);

canvas.attach(".minMaxFinder-canvas-wrapper");

// Draw X/Y graph divisions
for (let x = -maxDist; x < maxDist; x += graphDivisionDist) {
	if (x == 0) continue;
	const { x: startX, y: startY } = getPointAt({ x, y: -maxDist }),
		{ x: endX, y: endY } = getPointAt({ x, y: maxDist });

	canvas.fillLine(startX, startY, endX, endY, "#ccc");
}

for (let y = -maxDist; y < maxDist; y += graphDivisionDist) {
	if (y == 0) continue;
	const { x: startX, y: startY } = getPointAt({ x: -maxDist, y }),
		{ x: endX, y: endY } = getPointAt({ x: maxDist, y });

	canvas.fillLine(startX, startY, endX, endY, "#ccc");
}
console.log(-maxDist*scaling, scaling);
// Draw X/Y Axis
canvas.fillLine(-maxDist*scaling, halfScaledDist, maxDist*scaling, halfScaledDist, "#000", 2);
canvas.fillLine(halfScaledDist, -maxDist*scaling, halfScaledDist, maxDist*scaling, "#000", 2);
console.log(-maxDist*scaling);
{
	const { x, y } = getPointAt({ x: 5, y: 5 });

	canvas.fillCircle("#000", x, y, 5);
}

const { plots } = plotFunction(func, "x", "#f00", true);
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

alert(`x: ${ min.x }, y: ${ min.y }`);