import Canvas from "./Canvas";
import { AbstractGraphPoint, GraphPoint, GraphPointManager, Point, PointSet, ScaledGraphPoint } from "./Point";

interface GraphOptions {
	canvasSize: number;
	selector: string | HTMLElement;
	graph?: {
		divisionDistance?: number;
		size?: number;
		stepSize?: number;
	};
}

export default class Graph {
	canvas: Canvas | null = null;
	center: GraphPoint | null = null;

	divisionDistance: number = 0;
	size: number = 0;
	halfSize: number = 0;
	canvasSize: number = 0;
	stepSize: number = 0;
	points: Set<Point> = new Set();

	canvasScaleRatio: number = 1;
	canvasHalfScaleRatio: number = 1;
	scaledCanvasSize: number = 0;
	halfCanvasSize: number = 0;

	edgeMidPoints: ScaledGraphPoint[] = [];
	corners: ScaledGraphPoint[] = [];

	#cache: GraphPointManager<typeof GraphPoint>;

	constructor({
		canvasSize,
		selector,
		graph: {
			divisionDistance = 100,
			size = 100,
			stepSize = 0.1,
		} = {},
	}: GraphOptions = {} as GraphOptions) {
		this.canvas = new Canvas({
			width: canvasSize,
			height: canvasSize,
		});

		this.size = size;
		this.halfSize = size / 2;

		this.canvasScaleRatio = canvasSize / size;
		this.canvasHalfScaleRatio = this.canvasScaleRatio / 2;
		this.scaledCanvasSize = this.canvasScaleRatio * this.size;
		this.canvasSize = canvasSize;
		this.stepSize = stepSize;

		this.halfCanvasSize = this.scaledCanvasSize / 2;

		this.divisionDistance = divisionDistance;
		this.#cache = new GraphPointManager(this, GraphPoint);
		this.center = this.getPointAt(this.halfCanvasSize, this.halfCanvasSize);

		this.canvas.attach(selector);
		this.createBasePoints();
		this.drawDivisions();
	}

	createBasePoints(): this {
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

	drawDivisions(): this {
		const xStart = this.edgeMidPoints[1];
		const xEnd = this.edgeMidPoints[3];
		const yStart = this.edgeMidPoints[0];
		const yEnd = this.edgeMidPoints[2];

		this.canvas!.fillLine(xStart.x, xStart.y, xEnd.x, xEnd.y, "#000", 2);
		this.canvas!.fillLine(yStart.x, yStart.y, yEnd.x, yEnd.y, "#000", 2);

		return this;
	}

	getPointAt(x: number | { x?: number; y?: number } = 0, y: number = 0): GraphPoint {
		const coordX = typeof x === 'number' ? x : (x?.x ?? 0);
		const coordY = typeof x === 'number' ? y : (x?.y ?? 0);
		return this.#cache.getPointAt(coordX, coordY);
	}

	getScaledPos(x: number | { x?: number; y?: number } = 0, y: number = 0): ScaledGraphPoint {
		const coordX = typeof x === 'number' ? x : (x?.x ?? 0);
		const coordY = typeof x === 'number' ? y : (x?.y ?? 0);
		return this.getPointAt(coordX, coordY).toScaled();
	}

	scale(n: number = 0): number {
		return this.canvasScaleRatio * n;
	}

	descale(n: number = 0): number {
		return n / this.canvasScaleRatio;
	}
}

export {
	AbstractGraphPoint,
	Canvas,
	GraphPoint,
	GraphPointManager,
	Point,
	PointSet,
	ScaledGraphPoint,
};
