import AbstractGraphPoint from "./AbstractGraphPoint";
import PointSet from "./PointSet";
import Point from "./Point";
import type { Graph } from "..";

export default class GraphPointManager<T extends typeof AbstractGraphPoint = typeof AbstractGraphPoint> {
	#set = new PointSet();
	#graph: Graph;
	#pointConstructor: T;

	constructor(
		graph: Graph,
		pointConstructor: T = AbstractGraphPoint as T,
		...points: Point[]
	) {
		this.#graph = graph;
		this.#pointConstructor = pointConstructor;
		this.#set.addAll(...points);
	}

	getPointAt(x: number | { x?: number; y?: number } = 0, y: number = 0): InstanceType<T> {
		const coordX = typeof x === 'number' ? x : (x?.x ?? 0);
		const coordY = typeof x === 'number' ? y : (x?.y ?? 0);

		if (this.#set.has(coordX, coordY)) {
			return this.#set.get(coordX, coordY) as InstanceType<T>;
		}

		const newPoint = new this.#pointConstructor(this.#graph, coordX, coordY) as InstanceType<T>;
		this.#set.add(newPoint);
		return newPoint;
	}
}
