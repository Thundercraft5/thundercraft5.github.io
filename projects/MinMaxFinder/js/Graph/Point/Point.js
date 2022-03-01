export default class Point {
	#x = 0;
	#y = 0;

	get x() { return this.#x; }
	set x(x) { this.#x = x; }

	get y() { return this.#y; }
	set y(y) { this.#y = y; }

	/** @param {{ x: number, y: number } | number} x */
	constructor(x = 0, y = 0) {
		if (x?.x != null || x?.y != null) y = x.y || 0, x = x.x || 0;

		this.x = x;
		this.y = y;
	}

	* [Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}
}