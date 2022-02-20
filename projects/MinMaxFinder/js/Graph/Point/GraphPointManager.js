import { AbstractGraphPoint, PointSet } from "./index.js";

/**
 * @typedef {import("..").Graph} Graph
 * @typedef {import("..").Point} Point
 */
/** @template {typeof AbstractGraphPoint} T */
export default class GraphPointManager {
	#set = new PointSet();
	/** @type {Graph} */
	#graph = null;
	/** @type {T} */
	#pointConstructor = AbstractGraphPoint;

	constructor(
		/** @type {Graph} */ graph,
		/** @type {T} */ pointConstructor = AbstractGraphPoint,
		/** @type {Point[]} */ ...points
	) {
		this.#graph = graph;
		this.#pointConstructor = pointConstructor;
		this.#set.addAll(...points);
	}

	/** @return {InstanceType<T>} */
	getPointAt(x, y) {
		if (this.#set.has(x, y)) return this.#set.get(x, y);

		const newPoint = new this.#pointConstructor(this.#graph, x, y);

		this.#set.add(newPoint);

		return newPoint;
	}
}