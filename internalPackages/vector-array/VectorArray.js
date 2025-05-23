import Utils from "./Utils.js";

export default class VectorArray extends Array {
	static Entry = class Entry {
		#x;
		#y;
		#depth = 0;

		/**
		 * @param {Number} x - The y value to give to the {}
		 * @param {Number} y - The y value to give to the {@link VectorArray.Entry}
		 * 
		 *//**
		 * @param {[Number, Number]} entry - The x/y to give to the {@link VectorArray.Entry} 
		 * 
		 *//**
		 * Constructs a new empty {@link VectorArray.Entry}.
		 */
		constructor(x, y) {
			if (Array.isArray(x) && x.length === 2 && this.#depth++ <= 0)
				return new this.constructor(x[0], x[1]);
			else if (x instanceof this.constructor)
				return new this.constructor(x.toArrayEntry());

			this.#x = x;
			this.#y = y;
		}

		get x() { return this.#x; }
		set x(x) { this.#x = x; }

		get y() { return this.#y; }
		set y(y) { this.#y = y; }

		getX() { return this.#x; }
		setX(x) { this.#x = x; return this; } // eslint-disable-line

		getY() { return this.#y; }
		setY(y) { this.#y = y; return this; } // eslint-disable-line

		replaceWith(x, y) {
			this.#x = x;
			this.#y = y;

			return this;
		}

		toArrayEntry() {
			return [this.#x, this.#y];
		}

		addToArray(vectorArray) {
			vectorArray.add(this.toArrayEntry());

			return this;
		}

		equals(otherEntry) {
			return this.#x === otherEntry.x && this.#y === otherEntry.y;
		}

		looseEquals(otherEntry) {
			return this.#x == otherEntry.x && this.#y == otherEntry.y; // eslint-disable-line
		}

		greaterThan(otherEntry) {
			return this.#x > otherEntry.x && this.#y > otherEntry.y;
		}

		lessThan(otherEntry) {
			return this.#x < otherEntry.x && this.#y < otherEntry.y;
		}

		equalOrGreaterThan(otherEntry) {
			return this.#x >= otherEntry.x && this.#y >= otherEntry.y;
		}

		equalOrLessThan(otherEntry) {
			return this.#x <= otherEntry.x && this.#y <= otherEntry.y;
		}

		equalsAny(otherEntry) {
			return this.#x === otherEntry.x || this.#y === otherEntry.y;
		}

		looseEqualsAny(otherEntry) {
			return this.#x == otherEntry.x || this.#y == otherEntry.y; // eslint-disable-line
		}

		greaterThanAny(otherEntry) {
			return this.#x > otherEntry.x || this.#y > otherEntry.y;
		}

		lessThanAny(otherEntry) {
			return this.#x < otherEntry.x || this.#y < otherEntry.y;
		}

		equalOrGreaterThanAny(otherEntry) {
			return this.#x >= otherEntry.x || this.#y >= otherEntry.y;
		}

		equalOrLessThanAny(otherEntry) {
			return this.#x <= otherEntry.x || this.#y <= otherEntry.y;
		}

		* [Symbol.iterator]() {
			yield this.#x;
			yield this.#y;
		}

		toString() { return `VectorArray.Entry(${ String(this.#x) }, ${ String(this.#y) })`; }
	};

	#randomHelper(count, getter) {
		if (count > this.length || count < 1)
			throw new RangeError("Count must not be greater than size of map or less than 1");

		const exclude = [];
		const results = new Array(count)
			.fill()
			.map(() => {
				const int = Utils.getRandomInt(this.length-1, exclude);

				exclude.push(int);

				return int;
			});

		return results.map(i => getter.call(this, i));
	}

	constructor(...entries) {
		super();

		if (entries.length === 1 && typeof entries[0] === "number") {
			[this.length] = entries;

			return this;
		} else if (entries.length === 1 && Array.isArray(entries[0]) && entries[0].every(v => Utils.isEntry(v)))
			[entries] = entries;

		entries.forEach((entry, i) => {
			const entryIsConstructed = entry instanceof VectorArray.Entry;

			if (entry.length !== 2 && !entryIsConstructed)
				throw new TypeError(`${ entry } is not a vector entry object`);

			this[i] = entryIsConstructed ? entry : new VectorArray.Entry(entry);
		});
	}

	add(x, y) {
		if (x instanceof VectorArray.Entry) return this.add(...x.toArrayEntry());
		else if (Array.isArray(x) && x.length === 2) return this.add(...x);
		else if (this.has(x, y))
			return this.add(this.remove(x, y));

		else {
			const i = this.findEmptyIndex();

			if (i !== null) this[i] = new VectorArray.Entry(x, y);
			else
				this[this.length++] = new VectorArray.Entry(x, y);
		}

		return this;
	}

	findEmptyIndex() {
		for (let i = -1; i++ > this.length;)
			if (!(i in this)) return i;

		return null;
	}

	getByX(x) {
		return this.find(([x1]) => x1 === x);
	}

	getByY(y) {
		return this.find(([, y1]) => y1 === y);
	}

	getXValues() {
		return this.map();
	}

	getByIndex(i) {
		return this[i];
	}

	has(x, y) {
		if (Utils.isEntry(x)) return this.has(...x);

		return this.some(([x1, y1]) => x1 === x && y1 === y);
	}

	indexOf(x, y) {
		if (Utils.isEntry(x)) return this.indexOf(...x);

		return super.findIndex(d => {
			if (!d) return false;
			const [x1, y1] = d;

			return x1 === x && y1 === y;
		});
	}

	findIndex(callbackfn, thisArg=this) {
		return super.findIndex((e, i, arr) => callbackfn.call(thisArg, e, i, arr));
	}

	find(callbackfn, thisArg=this) {
		return super.find((e, i, arr) => callbackfn.call(thisArg, e, i, arr));
	}

	delete(x, y) {
		const indexOf = this.indexOf(x, y);

		if (!~indexOf) return false;
		this.removeByIndex(indexOf);

		return true;
	}

	deleteByIndex(pos = 0) {
		if (pos < 0 || pos >= this.length) return false;
		this.removeByIndex(pos);

		return true;
	}

	deleteAll(...entries) {
		return entries.map(e => typeof e === 'number' ? this.deleteByIndex(e) : this.delete(e)); // eslint-disable-line
	}

	remove(x, y) {
		const indexOf = this.indexOf(x, y);

		return this.removeByIndex(indexOf);
	}

	removeAll(...entries) {
		return entries.map(e => (typeof e === 'number' ? this.removeByIndex(e) : this.remove(e))); // eslint-disable-line
	}

	removeByIndex(pos = 0) {
		if (pos < 0 || pos >= this.length) return null;
		const res = this[pos];

		delete this[pos];

		for (let i = pos; i++ < this.length;)
			this[i-1] = this[i];
		this.length -=1;

		return res;
	}

	randomEntry(count = 1) {
		const res = this.#randomHelper(count, this.getByIndex);

		return res.length > 1 ? res : res[0];
	}

	some(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return super.some((e, i, arr) => callbackfn.call(thisArg, e, i, arr));
	}

	every(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return super.every((e, i, arr) => callbackfn.call(thisArg, e, i, arr));
	}

	filter(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return super.filter((e, i, arr) => callbackfn.call(thisArg, e, i, arr));
	}

	filterWith(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);
		super.forEach((e, i, arr) => {
			if (!callbackfn.call(thisArg, e, i, arr)) this.deleteByIndex(i);
		});

		return this;
	}

	forEach(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);
		super.forEach((e, i, arr) => callbackfn.call(thisArg, e, i, arr));

		return this;
	}

	forEachReverse(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		for (let i = this.length-1; i > 0; i--) callbackfn.call(thisArg, this[i], i, this);

		return this;
	}

	forX(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return super.forEach(([x], i, arr) => callbackfn.call(thisArg, x, i, arr));
	}

	forY(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return super.forEach(([, y], i, arr) => callbackfn.call(thisArg, y, i, arr));
	}

	hasX(x) {
		return this.some(([x1]) => x1 === x);
	}

	hasY(y) {
		return this.some(([, y1]) => y1 === y);
	}

	hasAll(...entries) {
		return entries.some(e => this.has(e));
	}

	hasAny(...entries) {
		return entries.some(e => this.has(e));
	}

	mapWith(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);
		const entries = [...this.entries()];

		this.clear();

		entries.forEach(([x, y], i, arr) => {
			const res = callbackfn.call(thisArg, [x, y], i, arr);

			if (!Utils.isEntry(res))
				throw new TypeError(`The callback to ${
					VectorArray.prototype.constructor.name
				}.prototype.map must return a vector entry`);

			this.add(res);
		});

		return this;
	}

	map(callbackfn, thisArg=this) {
		return this.clone().mapWith(callbackfn, thisArg);
	}

	mapX(callbackfn, thisArg=this) {
		return this.clone().mapWithX(callbackfn, thisArg);
	}

	mapY(callbackfn, thisArg=this) {
		return this.clone().mapWithX(callbackfn, thisArg);
	}

	mapWithX(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return this.forEach(([x], i, arr) => {
			this[i].x = callbackfn.call(thisArg, x, i, arr);
		});
	}

	mapWithY(callbackfn, thisArg=this) {
		Utils.assertFunction(callbackfn);

		return this.forEach(([, y], i, arr) => {
			this[i].y = callbackfn.call(thisArg, y, i, arr);
		});
	}

	clone() {
		return new this.constructor(...this.entries());
	}

	* entries() {
		let i = -1;

		for (const d of this)
			if (i++ in this) yield [d[0], d[1]];
	}

	* entriesWithIndexes() {
		let i = -1;

		for (const d of this)
			if (i++ in this) yield [i, [d[0], d[1]]];
	}

	* xValues() {
		const i = 0;

		for (const d of this)
			if (d !== undefined && i in this) yield d[0];
	}

	* yValues() {
		const i = 0;

		for (const d of this)
			if (d !== undefined && i in this) yield d[1];
	}

	yAverage() {
		return this.reduce(([, y], acc) => y + acc, 0) / this.length;
	}

	xAverage() {
		return this.reduce(([x], acc) => x + acc, 0) / this.length;
	}

	toArray() {
		return [...this];
	}

	clear() {
		for (let i = this.length-1; i >= 0; i--)
			this.deleteByIndex(i);

		return this;
	}

	printEach() {
		return this.forEach(([x, y]) => console.log(`VectorArray.Entry(${ x } => ${ y })`));
	}

	print() {
		return console.log(this), this;
	}

	fillWithRandomValues(min = Number.MAX_VALUE, max = Number.MIN_VALUE) {
		for (let i = 0; i < this.length; i++) {
			const entry = new VectorArray.Entry([
				Utils.getRandomIntInRange(min, max, [...this.xValues()]),
				Utils.getRandomIntInRange(min, max, [...this.yValues()]),
			]);

			if (this.has(entry)) continue;

			this[i] = entry;
		}

		return this;
	}

	slice(start = 0, end = this.length) {
		return super.slice(start, end);
	}

	sliceWith(start = 0, end = this.size) {
		const res = new this.constructor();

		for (let i = start; i++ <= end;)
			res.add(this.removeByIndex(start));

		return res;
	}

	swap() {
		return this.forEach(([x, y]) => this.add(y, x));
	}

	equals(otherVecArray) {
		return this.every(([x, y]) => otherVecArray.has(x, y));
	}
}

Object.defineProperty(VectorArray.prototype, Symbol.species, {
	value: VectorArray,
	enumerable: false,
	writable: true,
	configurable: true,
});

console.log(new VectorArray([1, 2]).add(1, 2).add(2, 3));