export class MapUtils {
	/*** Helper functions ***/
	static assertCallbackMapEntry(v) {
		if (!Array.isArray(v) && v.length !== 2) 
			throw new TypeError(
				`Return value of callback must be an array with a length of 2, received ${ MapUtils.toRepresentation(v) }`, // eslint-disable-line
			);

		return v;  
	};
	static assertFunction(v, nullable = false) {
		if (!(v instanceof Function) && (nullable ? v != null : true)) 
			throw new TypeError(`${ MapUtils.toRepresentation(v) } is not a function`);

		return v;
	};

	static toRepresentation(v) {
		if (!v || v instanceof Boolean) 
			return String(v);
		else if (v.__proto__.constructor.name !== "" && typeof(v) === "object" && !Array.isArray(v)) 
			return `#<${ v.__proto__.constructor.name }>`;
		else if (typeof(v) === "object" && v[Symbol.toStringTag] || Array.isArray(v)) 
			return Object.prototype.toString.call(v);
		else return `${ v }`;
	}

	static replaceHelper(map, callbackfn, thisArg, k, v, _, c) {
		const [newK, newV] = MapUtils.assertCallbackMapEntry(callbackfn.call(thisArg, k, v, this, c));
		
		map.set(newK, newV);
		
		return map;
	}

	static isMapEntryArray(array){
		return Array.isArray(array) 
			&& array.every(v => Array.isArray(v) && v.length <= 2);
	}

	static getStackName(level) {
		let {stack} = new Error();

		stack = stack.split('\n')[level];
		stack = stack.replace(/^\s*at/i, '');
		[stack] = stack.split('(');
		stack = stack.trim();
		stack = stack.slice(stack.indexOf('.') > -1 ? stack.indexOf('.') + 1 : undefined);

		return `${ Map.prototype.constructor.name }.prototype.${ stack }`;
	}

	static getClassName(v) {
		return v.prototype.constructor.name;
	}

	static getRandomInt(max, exclude) {
		const int = Math.ceil(Math.random() * max);

		if ((Array.isArray(exclude) && exclude.includes(int)) || int === exclude) 
			return MapUtils.getRandomInt(max, exclude);
		else 
			return int;
	}
}