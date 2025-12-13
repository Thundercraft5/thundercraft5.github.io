export default class Point {
	#x: number = 0;
	#y: number = 0;

	get x(): number { return this.#x; }
	set x(x: number) { this.#x = x; }

	get y(): number { return this.#y; }
	set y(y: number) { this.#y = y; }

	constructor(x: number | { x?: number; y?: number } = 0, y: number = 0) {
		if (x != null && typeof x === 'object' && ('x' in x || 'y' in x)) {
			this.y = x.y ?? 0;
			this.x = x.x ?? 0;
		} else {
			this.x = typeof x === 'number' ? x : 0;
			this.y = y;
		}
	}

	*[Symbol.iterator](): Generator<number, void, unknown> {
		yield this.x;
		yield this.y;
	}
}
