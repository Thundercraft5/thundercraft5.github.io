import GraphPoint from "./GraphPoint";
import AbstractGraphPoint from "./AbstractGraphPoint";
import type { Graph } from "..";

export default class ScaledGraphPoint extends AbstractGraphPoint {
	graph: Graph | null = null;

	constructor(graph: Graph, x: number | { x?: number; y?: number } = 0, y: number = 0) {
		const rawX = typeof x === 'number' ? x : (x?.x ?? 0);
		const rawY = typeof x === 'number' ? y : (x?.y ?? 0);

		super(graph, graph.scale(rawX), graph.scale(rawY));
		this.graph = graph;
	}

	toDescaled(): GraphPoint {
		return new GraphPoint(this.graph!, this.graph!.descale(this.x), this.graph!.descale(this.y));
	}

	getDescaledX(): number {
		return this.graph!.descale(this.x);
	}

	getDescaledY(): number {
		return this.graph!.descale(this.y);
	}
}
