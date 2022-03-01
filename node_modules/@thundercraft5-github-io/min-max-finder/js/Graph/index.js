/* eslint-disable prefer-destructuring */
import { AbstractGraphPoint, GraphPoint, GraphPointManager, Point, PointSet, ScaledGraphPoint } from "./Point/index.js";
import Canvas from "./Canvas.js";

export default class Graph {
	/** @type {Canvas} */
	canvas = null;
	/** @type {GraphPoint} */
	center = null;

	divisionDistance = 0;
	size = 0;
	stepSize = 0;
	points = new Set();

	canvasScaleRatio = 1;
	canvasHalfScaleRatio = 1;
	scaledCanvasSize = 0;
	halfCanvasSize = 0;

	/** @type {ScaledGraphPoint[]} */
	edgeMidPoints = [];
	/** @type {ScaledGraphPoint[]} */
	corners = [];

	#cache = new GraphPointManager(this, GraphPoint);

	constructor({
		canvasSize,
		selector,
		graph: {
			divisionDistance = 100,
			size = 100,
			stepSize = 0.1,
		} = {},
	} = {}) {
		this.canvas = new Canvas({
			width: canvasSize,
			height: canvasSize,
		});

		this.size = size;
		this.halfSize = size/2;

		this.canvasScaleRatio = canvasSize / size;
		this.canvasHalfScaleRatio = this.canvasScaleRatio/2;
		this.scaledCanvasSize = this.canvasScaleRatio * this.size;
		this.canvasSize = canvasSize;
		this.stepSize = stepSize;

		this.halfCanvasSize = this.scaledCanvasSize/2;

		this.divisionDistance = divisionDistance;
		this.center = this.getPointAt(this.halfCanvasSize, this.halfCanvasSize);

		this.canvas.attach(selector);
		this.createBasePoints();
		this.drawDivisions();
	}

	createBasePoints() {
		// In order, Clockwise, from top left
		this.corners = [
			{ x: 0, y: 0 }, // Top Left
			{ x: this.size, y: 0 }, // Top Right
			{ x: this.size, y: this.size }, // Bottom Right
			{ x: 0, y: this.size }, // Bottom Left
		].map(pos => this.getScaledPos(pos));

		// In order, Clockwise, from middle top
		this.edgeMidPoints = [
			{ x: this.halfSize, y: 0 }, // Middle Top
			{ x: this.size, y: this.halfSize }, // Middle Right
			{ x: this.halfSize, y: this.size }, // Middle Bottom
			{ x: 0, y: this.halfSize }, // Middle Left
		].map(pos => this.getScaledPos(pos));

		return this;
	}

	drawDivisions() {
		const xStart = this.edgeMidPoints[1];
		const xEnd = this.edgeMidPoints[3];
		const yStart = this.edgeMidPoints[0];
		const yEnd = this.edgeMidPoints[2];

		this.canvas.fillLine(xStart.x, xStart.y, xEnd.x, xEnd.y, "#000", 2);
		this.canvas.fillLine(yStart.x, yStart.y, yStart.x, yStart.y, "#000", 2);

		return this;
	}

	/** @param {number | {x: number, y: number}} x */
	getPointAt(x = 0, y = 0) {
		if (x?.x != null || x?.y != null) y = x.y || 0, x = x.x || 0;

		return this.#cache.getPointAt(x, y);
	}

	/** @param {number | {x: number, y: number}} x */
	getScaledPos(x = 0, y = 0) {
		if (x?.x != null || x?.y != null) y = x.y || 0, x = x.x || 0;

		return this.getPointAt(x, y).toScaled();
	}

	scale(n = 0) {
		return this.canvasScaleRatio * n;
	}

	descale(n = 0) {
		return n / this.canvasScaleRatio;
	}
}

export {
	AbstractGraphPoint,
	Canvas,
	Graph,
	GraphPoint,
	GraphPointManager,
	Point,
	PointSet,
	ScaledGraphPoint,
};