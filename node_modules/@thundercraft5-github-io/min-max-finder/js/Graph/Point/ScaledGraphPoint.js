import { AbstractGraphPoint } from "./index.js";
import GraphPoint from "./GraphPoint.js";

export default class ScaledGraphPoint extends AbstractGraphPoint {
	/** @type {import(".").Graph} */
	graph = null;

	constructor(graph, x = 0, y = 0) {
		if (x?.x != null || x?.y != null) y = x.y || 0, x = x.x || 0;

		super(x, y);
		this.graph = graph;
		this.x = graph.scale(x);
		this.y = graph.scale(y);
	}

	toDescaled() {
		return new GraphPoint(this, this.graph.descale(this.x), this.graph.descale(this.y));
	}

	getDescaledX() {
		return this.graph.descale(this.x);
	}

	getDescaledY() {
		return this.graph.descale(this.y);
	}
}