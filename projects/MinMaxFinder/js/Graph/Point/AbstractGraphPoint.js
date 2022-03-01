import Point from "./Point.js";

/** @typedef {import("..").Graph} Graph */
/** @typedef {import("..").Canvas} Canvas */
export default class AbstractGraphPoint extends Point {
	/** @type {Graph} */
	graph = null;
	/** @type {Canvas} */
	canvas = null;

	/** @param {number | {x: number, y: number}} x */
	constructor(graph, x = 0, y = 0) {
		if (x?.x != null || x?.y != null) y = x.y || 0, x = x.x || 0;

		super(x, y);
		this.graph = graph;
		this.canvas = graph.canvas;
	}
}