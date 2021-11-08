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
});