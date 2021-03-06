import VectorArray from "./VectorArray.js";

export default class Utils {
	static assertFunction(v, nullable = false) {
		if (!(v instanceof Function) && (nullable ? v != null : true))
			throw new TypeError(`${ Utils.toRepresentation(v) } is not a function`);

		return v;
	}

	static toRepresentation(v) {
		let ret;

		if (!v && v instanceof Boolean || v === null || v === undefined || isNaN(v))
			ret = String(v);
		else if (v.__proto__.constructor.name !== "" && typeof v === "object")
			ret = `#<${ v[Symbol.toStringTag] || v.__proto__.constructor.name }>`;
		else if (typeof v === "object" && v[Symbol.toStringTag] || Array.isArray(v))
			ret = Object.prototype.toString.call(v);
		else if (typeof v === "string")
			ret = `"${ v }"`;
		else ret = String(v);

		return `${ typeof v } ${ ret }`;
	}

	static replaceHelper(map, callbackfn, thisArg, k, v, _, c) {
		const [newK, newV] = Utils.assertCallbackMapEntry(callbackfn.call(thisArg, k, v, this, c));

		map.set(newK, newV);

		return map;
	}

	static isMapEntryArray(array) {
		return Array.isArray(array)
			&& array.every(v => Array.isArray(v) && v.length <= 2);
	}

	static getStackName(level) {
		let { stack } = new Error();

		stack = stack.split("\n")[level];
		stack = stack.replace(/^\s*AT/iu, "");
		[stack] = stack.split("(");
		stack = stack.trim();
		stack = stack.slice(stack.includes(".") ? stack.indexOf(".") + 1 : undefined);

		return `VectorArray.prototype.${ stack }`;
	}

	static getClassName(v) {
		return v.prototype.constructor.name;
	}

	static getRandomInt(max, exclude) {
		const int = Math.ceil(Math.random() * max);

		return Array.isArray(exclude) && exclude.includes(int) || int === exclude ? Utils.getRandomInt(max, exclude) : int;
	}

	static isEntry(v) {
		return Array.isArray(v) && v.length === 2 || v instanceof VectorArray.Entry;
	}

	static getRandomIntInRange(min, max, exclude = []) {
		min = Math.ceil(min);
		max = Math.floor(max);
		const ret = Math.floor(Math.random() * (max - min + 1)) + min;

		return exclude.includes(ret) ? Utils.getRandomIntInRange(min, max, exclude.concat(ret)) : ret;
	}
}