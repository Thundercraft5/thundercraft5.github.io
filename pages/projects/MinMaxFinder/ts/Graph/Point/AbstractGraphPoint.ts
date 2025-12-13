import Point from "./Point";
import type { Graph } from "..";
import type { Canvas } from "../Canvas";

export default class AbstractGraphPoint extends Point {
	graph: Graph | null = null;
	canvas: Canvas | null = null;

	constructor(graph: Graph, x: number | { x?: number; y?: number } = 0, y: number = 0) {
		super(x, y);
		this.graph = graph;
		this.canvas = graph.canvas;
	}
}
