import Point from "./Point.js";
import { isIterable } from "../../utils.js";

export default class PointSet extends Set {
	/** @type {{[key: any]: Point}} */
	#cache = {};

	constructor(/** @type {Point[]} */...items) {
		super();

		items.forEach(point => this.add(point));
	}

	add(/** @type {Point} */ point) {
 		super.add(point);
		this.#cache[[point.x, point.y]] = point;

		return this;
	}

	addAll(/** @type {Point[]} */ ...points) {
		points.forEach(point => this.add(point));

		return this;
	}

	/** @return {Point} */
	get(x = 0, y = 0) {
		return this.#cache[[x, y]];
	}

	has(/** @type {Point|number} */ point, y = 0) {
		return typeof point === "number"
			? !!this.#cache[[point, y]]
			: !!this.#cache[[point.x, point.y]];
	}

	delete(/** @type {Point|number} */ point, y = 0) {
		const has = this.has(...arguments);

		if (typeof point === "number") delete this.#cache[point, y];
		else delete this.#cache[[point.x, point.y]];

		return has;
	}
}