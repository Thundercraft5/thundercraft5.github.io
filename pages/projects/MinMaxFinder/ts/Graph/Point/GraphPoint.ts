import AbstractGraphPoint from "./AbstractGraphPoint";
import ScaledGraphPoint from "./ScaledGraphPoint";
import type { Graph } from "..";

export default class GraphPoint extends AbstractGraphPoint {
	constructor(graph: Graph, x: number | { x?: number; y?: number } = 0, y: number = 0) {
		super(graph, x, y);
	}

	toScaled(): ScaledGraphPoint {
		return new ScaledGraphPoint(this.graph!, this.getScaledX(), this.getScaledY());
	}

	getScaledX(): number {
		return this.graph!.scale(this.x);
	}

	getScaledY(): number {
		return this.graph!.scale(this.y);
	}
}
