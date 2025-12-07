export function extend(target, targetPrototype, methods) {
	if (!methods && typeof targetPrototype === "object") methods = targetPrototype, targetPrototype = null;

	for (const [k, v] of Object.entries(methods))
		methods[k] = {
			value: v,
			writable: true,
			configurable: true,
			enumerable: false,
		};

	Object.defineProperties(targetPrototype ? target.prototype : target, methods);

	return target;
}export function extendProperties(target, properties) {
	for (const [k, v] of Object.entries(properties)) {
		let constant = false,
			enumerable, value,
			options = {}; // eslint-disable-line

		if (typeof v === "object") ({ constant, value, enumerable = true } = v);
		else value = v;

		if (constant) Object.assign(options, {
			writable: false,
			configurable: false,
		});

		Object.assign(options, { enumerable, value });
		console.log(value);

		Object.defineProperty(target, k, options);
	}
}

extend(Number, true, {
	toRadians() {
		return this * (Math.PI / 180);
	},

	round(digits = 0) {
		return +this.toFixed(digits);
	},
});

extendProperties(Math, {
	G: {
		constant: true,
		enumerable: false,
		value: -9.806_65,
	},

	isin(x) {
		return this.asin(this.sin(x));
	},

	icos(x) {
		return this.acos(this.cos(x));
	},

	itan(x) {
		return this.atan(this.tan(x));
	},
});

extend(Function, true, {
	bindParamsLimit(thisArg, limit = 1) {
		return function() {
			return this.apply(thisArg, Array.from(arguments).slice(0, limit));
		}.bind(this);
	},
});