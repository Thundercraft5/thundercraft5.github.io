import AbstractGraphPoint from "./AbstractGraphPoint.js";
import ScaledGraphPoint from "./ScaledGraphPoint.js";

/** @typedef {import(".").Graph} Graph */
export default class GraphPoint extends AbstractGraphPoint {
	/** @param {number | {x: number, y: number}} x */
	constructor(graph, x = 0, y = 0) {
		if (x?.x != null || x?.y != null) y = x.y || 0, x = x.x || 0;
		super(graph, x, y);
	}

	toScaled() {
		return new ScaledGraphPoint(this.graph, this.getScaledX(), this.getScaledY());
	}

	getScaledX() {
		return this.graph.scale(this.x);
	}

	getScaledY() {
		return this.graph.scale(this.y);
	}
}