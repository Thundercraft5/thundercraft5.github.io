// import { webcrypto as crypto } from "crypto";

Object.defineProperties(Object, {
	assignMethods: { // Test
		value: {
			assignMethods(targetObject, methods = {}, rawAssign = false) {
				if (!rawAssign && typeof methods !== "object") if (typeof targetObject !== "function") throw new TypeError("Target object must be a class or function");

				if (!rawAssign) if (!targetObject.prototype) throw new TypeError("Target object must have a prototype");

				const descriptors = {};

				// eslint-disable-next-line curly
				for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(methods))) {
					if ("set" in descriptor || "get" in descriptor) descriptors[key] = {
						set: descriptor.set,
						get: descriptor.get,
						enumerable: false,
						writable: true,
						configurable: true,
					}; else descriptors[key] = {
						value: descriptor.value,
						enumerable: false,
						writable: true,
						configurable: true,
					};
				}

				if (rawAssign) Object.defineProperties(targetObject, descriptors);
				else Object.defineProperties(targetObject.prototype, descriptors);

				return targetObject;
			},
		}.assignMethods,
	},
});

Object.assignMethods(Array, {
	indexAt(index = 0) {
		return this.indexOf(this.at(index));
	},
	removeByIndex(key = 0) {
		if (!this.length) return { key: null, value: undefined };
		if (isNaN(key)) return this.removeByIndex(0);

		return { key: this.indexAt(key), value: this.splice(key, 1)[0] };
	},

	remove(value) {
		if (arguments.length === 0) return !!this.removeByIndex(0).key;
		if (!this.length) return false;

		const i = this.indexOf(value);

		if (i === -1) return false;
		this.removeByIndex(i);

		return true;
	},

	removeFrom(value) {
		if (arguments.length > 1) return [...arguments].forEach(value => this.remove(value)), this;
		this.remove(value);

		return this;
	},

	removeWith(callbackfn, thisArg = this) {
		const i = this.findIndex(callbackfn, thisArg);

		if (i === -1) return { key: null, value: undefined };

		return this.removeByIndex(i);
	},

	maxIndex(resolveFunc) {
		if (this.length === 0) throw new TypeError("Cannot call Array.prototype.max() on an empty array");
		else if (this.length === 1) return 0;

		let len = this.length,
			i = -1,
			found = -Infinity;

		while (len--) {
			const resolved = resolveFunc ? resolveFunc(this[len]) : this[len];

			if (Number(resolved) > found) {
				i = len;
				found = resolved;
			}
		}

		return i;
	},

	max() {
		return this[this.maxIndex()];
	},

	min() {
		return this[this.minIndex()];
	},

	minIndex(resolveFunc) {
		if (this.length === 0) throw new TypeError("Cannot call Array.prototype.max() on an empty array");
		else if (this.length === 1) return 0;

		let len = this.length,
			found = Infinity,
			i = -1;

		while (len--) {
			const resolved = resolveFunc ? resolveFunc(this[len]) : this[len];

			if (Number(resolved) < found) {
				i = len;
				found = resolved;
			}
		}

		return i;
	},

	clone(deep = false) {
		if (deep) this.map(v => Array.isArray(v) ? v.clone() : v);
		else return this.slice();
	},

	greatest(compare, thisArg = this) {
		if (this.length === 0) throw new TypeError("Cannot call .greatest() on an empty array");

		const i = this.greatestIndex(compare, thisArg = this);

		if (i === -1) return;

		return this[i];
	},

	greatestIndex(compare, thisArg = this) {
		if (this.length === 0) throw new TypeError("Cannot call .greatestIndex() on an empty array");
		else if (this.length === 1) return 0;

		let ret, prev,
			j = -1;

		this.forEach((value, i) => {
			if (i === 0) return prev = value;
			else if (i === 1) ret = value;

			if (i === 1) {
				const v = compare.call(thisArg, value, prev, i, this);

				if (v) {
					ret = prev;
					j = 0;

					return;
				}
			}

			if (compare.call(thisArg, prev, value, i, this)) {
				prev = ret;
				ret = value;
				j = i;
			}
		});

		return j;
	},

	clear() {
		this.splice(0, this.length);

		return this;
	},

	concatFrom(...items) {
		items.forEach(item => {
			if (Array.isArray(item)) item.forEach(item => this.push(item));
			else this.push(item);
		});

		return this;
	},

	toSet() {
		return new Set(this);
	},

	uniqueOf() {
		const s = this.toSet();

		this.clear().push(...s);

		return this;
	},

	unique() {
		return this.clone().uniqueOf();
	},

	replaceWith(otherArray) {
		return this.clear().push(...otherArray);
	},

	insert(index = 0, ...values) {
		if (isNaN(index)) throw new TypeError(`Array index must be a number: ${index}`);
		this.splice(index, 0, ...values);

		return this;
	},
});

Object.assign(Math, {
	/**
	 * @augments Math
	 * @method clamp
	 */
	clamp(value, min = 0, max = Infinity) {
		if (value < min) return min;

		return value > max ? max : value;
	},
});

Object.assign(Object, {
	compose(target, composeFunc, thisArg = target) {
		return Object.fromEntries(Object.entries(target)
			.map(([key, value]) => composeFunc.call(thisArg, key, value, target)));
	},
});

function arrayMax(arr) {
	let len = arr.length,
		max = -Infinity;

	while (len--)
		if (Number(arr[len]) > max) max = Number(arr[len]);


	return max;
}