Object.assign(Array.prototype, {
	removeByIndex(key = 0) {
		if (!this.length) return { key: null, value: undefined };
		if (isNaN(key)) return this.removeByIndex(0);

		return { key, value: this.splice(key, 1)[0] };
	},

	remove(value) {
		if (!arguments.length) return this.removeByIndex(0);
		if (!this.length) return false;

		const i = this.findIndex(v => v === value);

		if (i === -1) return false;

		return true;
	},

	removeWith(callbackfn, thisArg = this) {
		const i = this.findIndex(callbackfn, thisArg);

		if (i === -1) return { key: null, value: undefined };

		return this.removeByIndex(i);
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

	clone(deep = false) {
		if (deep) this.map(v => Array.isArray(v) ? v.clone() : v);
		else return this.slice();
	},
});


Object.assign(Math, {
	/**
	 * @augments Math
	 * @method clamp
	 */
	clamp(value, min = 0, max = Infinity) {
		if (value < min) return min;
		if (value > max) return max;

		else return value;
	},
});

new Array(crypto.getRandomValues(new Int8Array(50))).greatest((a, b) => a < b);