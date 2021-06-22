export default class Map extends globalThis.Map {
	#depth = 0;

	static Entry = class Entry {
		#key;
		#value; 
		#depth = 0;

		constructor(key, value) {
			if (key instanceof Array && key.length === 2 && this.#depth++ <= 0) 
				return new this.constructor(key[0], key[1]);
			this.#key = key;
			this.#value = value;
		}

		get key() { return this.#key; }
		set key(key) { this.#key = key; }

		get value() { return this.#value; }
		set value(value) { this.#value = value; }

		getKey() { return this.#key; }
		setKey(key) { this.#key = key; return this; } // eslint-disable-line

		getValue() { return this.#value; }
		setValue(value) { this.#value = value; return this; } // eslint-disable-line

		replaceWith(key, value) {
			this.#key = key;
			this.#value = value;
		}

		toArrayEntry() { 
			return [this.#key, this.#value];
		}

		addToMap(map) {
			map.set(this.toArrayEntry());

			return this;
		}

		* [Symbol.iterator]() {
			yield this.#key;
			yield this.#value;
		}
		toString() { return `Map.Entry(${ inspect(this.#key) } => ${ inspect(this.#value) })`; }
		valueOf() { return this.#value; }
	};

	/*** Helper functions ***/
	static #assertCallbackMapEntry = v => {
		if (!Array.isArray(v) && v.length !== 2) 
			throw new TypeError(
				`Return value of callback must be an array with a length of 2, received ${ Map.#toRepresentation(v) }`,
			);

		return v;  
	};
	static #assertFunction = (v, nullable = false) => {
		if (!(v instanceof Function) && (nullable ? v != null : true)) 
			throw new TypeError(`Callback must be of type "Function", received ${ Map.#toRepresentation(v) }`);

		return v;
	};

	static #toRepresentation = v => {
		if (v?.constructor.name) return `#<${ v.constructor.name }>`;
		else if (v !== undefined && v !== null) return Object.prototype.toString.call(v);
		else return `${ v }`;
	}

	static #replaceHelper = (map, callbackfn, thisArg, k, v, _, c) => {
		const [newK, newV] = Map.#assertCallbackMapEntry(callbackfn.call(thisArg, k, v, this, c));
		
		map.set(newK, newV);
		
		return map;
	}

	static #isMapEntryArray = array => Array.isArray(array) && array.every(v => Array.isArray(v) && v.length <= 2);

	static #assertThis = v => {
		if (!v instanceof Map) throw new TypeError();

		return v;
	}

	/*** Constructor ***/
	constructor(...entries) {
		super();
		this.setAll(...(Map.#isMapEntryArray(entries[0]) && this.#depth++ <= 0 ? entries[0] : entries));
		this.#depth = 0;
	}

	get size() { return super.size; }
	set size(size) {
		this.forEach((...[k,,, i]) => {
			if (i > size) this.delete(k);
		});
	}

	/*** Setters ***/
	setAll(...entries) {
		if (Map.#isMapEntryArray(entries[0]) && this.#depth++ <= 0) return this.setAll(...entries[0]); 
		else entries.forEach(([k, v]) => this.set(k, v));
		
		this.#depth = 0;

		return this;
	}

	set(k, v) {
		if (Array.isArray(k) && k.length === 2 && this.#depth++ <= 0) return this.set(...k);
		else if (k instanceof Map.Entry && arguments.length === 1) this.set(k.key, k.value);
		else super.set(k, v);

		this.#depth = 0;

		return this;
	}

	merge(...maps) {
		if (maps.length === 1 && this.#depth++ <= 0) {
			maps[0].forEach((k, v) => this.set(k, v));

			return this;
		} else if (maps.length > 1) 
			maps.forEach(map => this.merge(map));

		this.#depth = 0;

		return this;
	}

	/*** Getters ***/
	get(...keys) {
		if (keys.length > 1) 
			return keys.map(key => this.get(key));
		else 
			return super.get(keys[0]);
		
	}

	find(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		let res;

		this.forEach((...d) => {
			if (callbackfn.call(thisArg, ...d)) [res] = d;
		});

		return res;
	}

	findEntry(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		let res;

		this.forEach((...d) => {
			if (callbackfn.call(thisArg, ...d)) res = new Map.Entry(...d.slice(0, 2));
		});

		return res;
	}
			
	findKey(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		let res;

		this.forEach((...d) => {
			if (callbackfn.call(thisArg, ...d)) [, res] = d;
		});

		return res;
	}

	getByNumericKey(searchNum) {
		return this.findValue((...[,,, c]) => c === searchNum);
	}

	indexOf(searchValue) {
		let index;

		this.forEach((k, v) => (v === searchValue ? index = k : null));

		return index;
	}

	numericIndexOf(searchValue) {
		let index = -1;

		this.forEach((...[, v,, i]) => (v === searchValue ? index = i : null));

		return index;
	}

	/*** Iterative Methods ***/
	forEach(callbackfn, thisArg=this) {
		let count = 0;

		Map.#assertFunction(callbackfn);

		super.forEach((v, k, map) => {
			callbackfn.call(thisArg, k, v, map, count++);
		});

		return this;
	}

	toArray(mapFn=null, thisArg=this) {
		const results = [];

		Map.#assertFunction(mapFn, true);	

		if (mapFn) 
			this.forEach((...d) => results.push(mapFn.call(thisArg, ...d)));
		else 
			this.forEach((k, v) => results.push([k, v]));

		return results;
	}

	some(callbackfn, thisArg=this) {
		let res = false;

		Map.#assertFunction(callbackfn);

		this.forEach((...d) => {
			if (res) return;
			if (!!callbackfn.call(thisArg, ...d)) 
				res = true;
		});

		return res;
	}

	every(callbackfn, thisArg=this) {
		let res = true;

		Map.#assertFunction(callbackfn);

		this.forEach((...d) => {
			if (!res) return;
			if (!callbackfn.call(thisArg, ...d)) 
				res = false;
		});

		return res;
	}

	replace(callbackfn, thisArg=this) {
		const newMap = new this.constructor();
		
		this.forEach(Map.#replaceHelper.bind(null, newMap, Map.#assertFunction(callbackfn), thisArg));

		return this;
	}

	replaceWith(callbackfn, thisArg=this) {
		this.forEach(Map.#replaceHelper.bind(null, this, Map.#assertFunction(callbackfn), thisArg));

		return this;
	}

	mapKeys(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		const newMap = new this.constructor();

		this.forEach((k, v, map, i) => {
			const res = callbackfn.call(thisArg, k, v, map, i);

			newMap.set(res, v);
		});

		return newMap;
	}

	mapValues(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		const newMap = new this.constructor();


		this.forEach((k, v, map, i) => {
			const res = callbackfn.call(thisArg, k, v, map, i);

			newMap.set(k, res);
		});

		return newMap;
	}

	mapWithKeys(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		const entries = this.entries();

		this.clear();
		
		entries.forEach(([k, v], i) => {
			const res = callbackfn.call(thisArg, k, v, this, i);

			this.set(res, k);
		});
		
		return this;
	}

	mapWithValues(callbackfn, thisArg=this) {
		Map.#assertFunction(callbackfn);
		const keys = this.keys();
		
		keys.forEach((k, i) => {
			const res = callbackfn.call(thisArg, k, this.get(k), this, i);

			this.set(k, res);
		});
		
		return this;
	}

	/*** Utility Methods ***/
	clone() {
		const newMap = new this.constructor();

		this.forEach((k, v) => newMap.set(k, v));

		return newMap;
	}
	
	keys() {
		const res = [];

		this.forEach(k => res.push(k));

		return res;
	}

	entries() {
		return this.toArray();
	}

	values() {
		const res = [];

		this.forEach((...[, v]) => res.push(v));

		return res;
	}

	clear() {
		return super.clear();
	}

	delete(key) {
		return super.delete(key);
	}

	has(key) {
		return super.has(key);
	}

	hasAll(...keys) {
		return this.every(k => keys.includes(k));
	}

	hasAny(...keys) {
		return this.some(k => keys.includes(k));
	}

	toEntryArray() {
		return this.toArray((k, v) => new Map.Entry(k, v));
	}

	* [Symbol.iterator]() {
		for (const d of this.toArray()) yield d;
	}
}

const map = new Map(['$$$$', "EEEE"], ['!!!!!', "====="], ['%%%%', ">>>>"]);

map.mapWithKeys(v => `${ v }\\\\`).size = 1;
console.log(map);