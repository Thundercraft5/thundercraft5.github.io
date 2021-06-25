import { MapUtils } from "./MapUtils.js";

export default class Map extends globalThis.Map {
	#depth = 0;
	#locked = false;
	#requiredKeyType;
	#requiredValueType;
	#assertTypes = false;

	get locked() { return this.#locked; }
	set locked(_) { throw new TypeError("Cannot modify read-only property 'locked'"); }

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
	static #assertThis(v) {
		if (v?.__proto__?.constructor !== Map.prototype.constructor) 
			throw new TypeError(`Method ${ MapUtils.getStackName(3) } called on incompatible receiver ${MapUtils.toRepresentation(v)}`); // eslint-disable-line

		return v;
	}

	#assertNotLocked() {
		if (this.#locked) throw new TypeError('Cannot modify locked map');
		
		return this;
	}

	#assertType(k, v) {
		if (!(Object(k) instanceof this.#requiredKeyType) && this.#requiredKeyType)
			throw new TypeError(
				`Map keys must be of type "${ 
					MapUtils.getClassName(this.#requiredValueType)
				}", received "${
					v?.constructor.name || v
				}"`,
			);
		if (!(Object(v) instanceof this.#requiredValueType) && this.#requiredValueType)
			throw new TypeError(
				`Map values must be of type "${ 
					MapUtils.getClassName(this.#requiredValueType)
				}", received "${
					v?.constructor.name || v
				}"`,
			);
			
		return this;
	}

	#randomHelper(count, getter) {
		if (count > this.size || count < 1) 
			throw new RangeError('Count must not be greater than size of map or less than 1');

		const exclude = [];
		const results = new Array(count)
			.fill()
			.map(() => {
				const int = MapUtils.getRandomInt(this.size-1, exclude);

				exclude.push(int);

				return int;
			});

		return results.map(i => getter.call(this, i));
	}

	/*** Constructor ***/
	constructor(...entries) {
		super();
		this.setAll(...(MapUtils.isMapEntryArray(entries[0]) && this.#depth++ <= 0 ? entries[0] : entries));
		this.#depth = 0;
	}

	toJSON() {
		return JSON.stringify(this.toArray());
	}

	static fromJSON(json) {
		const ret = new Map(JSON.parse(json));

		return ret;
	}

	get size() { return super.size; }
	set size(size) {
		this.forEach((...[k,,, i]) => {
			if (i > size) this.delete(k);
		});
	}

	/*** Setters ***/
	setAll(...entries) {
		Map.#assertThis(this);

		if (MapUtils.isMapEntryArray(entries[0]) && this.#depth++ <= 0) 
			return this.setAll(...entries[0]); 
		else if (entries[0]?.__proto__?.constructor === Object) 
			return this.setAll(...Object.entries(entries[0]));
		else 
			entries.forEach(([k, v]) => this.set(k, v));
		
		this.#depth = 0;

		return this;
	}

	set(k, v) {
		Map.#assertThis(this);
		this.#assertNotLocked();

		if (Array.isArray(k) && k.length === 2 && this.#depth++ <= 0) 
			return this.set(...k);
		else if (k instanceof Map.Entry && arguments.length === 1) 
			this.set(k.key, k.value);
		else 
			super.set(k, v);

		if (this.#assertTypes) this.#assertType(k, v);
		this.#depth = 0;

		return this;
	}

	concat(...maps) {
		return this.clone().concatWith(...maps);
	}

	concatWith(...maps) {
		Map.#assertThis(this);

		if (maps.length === 1 && maps[0] instanceof Array)
			return this.concatWith(...maps[0]);
		else if (maps.length === 1 && this.#depth++ <= 0) {
			maps[0].forEach((k, v) => this.set(k, v));

			return this;
		} else if (maps.length > 1) 
			maps.forEach(map => this.concatWith(map));

		this.#depth = 0;

		return this;
	}

	difference(otherMap) {
		return otherMap.filter((_, k) => !this.has(k)).concat(this.filter((_, k) => !otherMap.has(k)));
	}

	intersect(other) {
		return other.filter((_, k) => this.has(k));
	}

	/*** Getters ***/
	get(...keys) {
		Map.#assertThis(this);

		if (keys.length > 1) 
			return keys.map(key => this.get(key));
		else 
			return super.get(keys[0]);
		
	}

	find(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		let res;

		this.forEach((...d) => {
			if (callbackfn.call(thisArg, ...d)) [res] = d;
		});

		return res;
	}

	findEntry(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		let res;

		this.forEach((...d) => {
			if (callbackfn.call(thisArg, ...d)) res = new MapUtils.Entry(...d.slice(0, 2));
		});

		return res;
	}
			
	findKey(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);
		let res;

		this.forEach((...d) => {
			if (callbackfn.call(thisArg, ...d)) [, res] = d;
		});

		return res;
	}


	getByIndex(searchNum) {
		Map.#assertThis(this);

		return this.find((...[,,, c]) => c === searchNum);
	}

	getKeyByIndex(searchNum) {
		Map.#assertThis(this);

		return this.findKey((...[,,, c]) => c === searchNum);
	}

	getEntryByIndex(searchNum) {
		Map.#assertThis(this);

		return this.findEntry((...[,,, c]) => c === searchNum);
	}

	indexOf(searchValue) {
		Map.#assertThis(this);
		let index;

		this.forEach((k, v) => (v === searchValue ? index = k : null));

		return index;
	}

	numericIndexOf(searchValue) {
		Map.#assertThis(this);
		let index = -1;

		this.forEach((...[, v,, i]) => (v === searchValue ? index = i : null));

		return index;
	}

	first(count = 1) {
		Map.#assertThis(this);
		const values = this.values();

		return count > 1 ? values.slice(count) : values[0];
	}

	firstKey(count = 1) {
		Map.#assertThis(this);
		const keys = this.keys();

		return count > 1 ? keys.slice(count) : keys[0];
	}	

	firstEntry(count = 1) {
		Map.#assertThis(this);
		const entries = this.toEntryArray();

		return count > 1 ? entries.slice(count) : entries[0];
	}	

	last(count = 1) {
		Map.#assertThis(this);
		const values = this.values();

		return count > 1 ? values.slice(values.length-count) : values[values.length-count];
	}

	lastKey(count = 1) {
		Map.#assertThis(this);
		const keys = this.keys();

		return count > 1 ? keys.slice(keys.length-count) : keys[keys.length-count];
	}	

	lastEntry(count = 1) {
		Map.#assertThis(this);
		const entries = this.toEntryArray();

		return count > 1 ? entries.slice(entries.length-count) : entries[entries.length-count];
	}

	random(count = 1) {
		Map.#assertThis(this);
		
		const results = this.#randomHelper(count, this.getByIndex);

		return count > 1 ? results : results[0];
	}

	randomKey(count = 1) {
		Map.#assertThis(this);
		
		const results = this.#randomHelper(count, this.getKeyByIndex);

		return count > 1 ? results : results[0];
	}

	randomEntry(count = 1) {
		Map.#assertThis(this);
		
		const results = this.#randomHelper(count, this.getEntryByIndex);

		return count > 1 ? results : results[0];
	}

	/*** Iterative Methods ***/
	forEach(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		let count = 0;

		super.forEach((v, k, map) => {
			callbackfn.call(thisArg, k, v, map, count++);
		});

		return this;
	}

	toArray(mapFn=null, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(mapFn, true);	

		const results = [];

		if (mapFn) 
			this.forEach((...d) => results.push(mapFn.call(thisArg, ...d)));
		else 
			this.forEach((k, v) => results.push([k, v]));

		return results;
	}

	toObject() {
		const ret = {};

		for (const [k, v] of this) ret[k] = v;

		return ret;
	}

	mapToFlatArray(mapFn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(mapFn);

		return this.toArray().flatMap(([k, v], i, arr) => mapFn.call(thisArg, k, v, arr, i));
	}

	some(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		let res = false;

		this.forEach((...d) => {
			if (res) return;
			if (!!callbackfn.call(thisArg, ...d)) 
				res = true;
		});

		return res;
	}

	every(callbackfn, thisArg=this) {
		MapUtils.assertFunction(callbackfn);
		Map.#assertThis(this);

		let res = true;

		this.forEach((...d) => {
			if (!res) return;
			if (!callbackfn.call(thisArg, ...d)) 
				res = false;
		});

		return res;
	}

	replace(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		const newMap = new this.constructor();
		
		this.forEach(MapUtils.replaceHelper.bind(null, newMap, callbackfn, thisArg));

		return this;
	}

	replaceWith(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		this.forEach(MapUtils.replaceHelper.bind(null, this, callbackfn, thisArg));

		return this;
	}

	mapKeys(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);
		const newMap = new this.constructor();

		this.forEach((k, v, map, i) => {
			const res = callbackfn.call(thisArg, k, v, map, i);

			newMap.set(res, v);
		});

		return newMap;
	}

	mapValues(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);
		const newMap = new this.constructor();

		this.forEach((k, v, map, i) => {
			const res = callbackfn.call(thisArg, k, v, map, i);

			newMap.set(k, res);
		});

		return newMap;
	}

	mapWithKeys(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);
		const entries = this.toArray();

		this.clear();
		
		entries.forEach(([k, v], i) => {
			const res = callbackfn.call(thisArg, k, v, this, i);

			this.set(res, k);
		});
		
		return this;
	}

	mapWithValues(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);
		const keys = this.keys();
		
		keys.forEach((k, i) => {
			const res = callbackfn.call(thisArg, k, this.get(k), this, i);

			this.set(k, res);
		});
		
		return this;
	}
	
	partition(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		const [passed, failed] = [new Map(), new Map()];

		this.forEach((k, v, map, i) => {
			if (callbackfn.call(thisArg, k, v, map, i)) passed.set(k, v);
			else failed.set(k, v);
		});

		return [passed, failed];
	}

	reduce(callbackfn, initialValue, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		if (initialValue == null && this.size === 0) 
			throw new TypeError('Reduce of empty map with no initial value');

		initialValue = initialValue != null ? initialValue : this.getByIndex(0);
		this.forEach((k, v, map, i) => initialValue = callbackfn.call(thisArg, initialValue, k, v, map, i));
		
		return initialValue;
	}

	filter(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		const results = new this.constructor();

		this.forEach((k, v, map, i) => {
			if (callbackfn.call(thisArg, k, v, map, i)) results.set(k, v);
		});

		return this;
	}

	filterWith(callbackfn, thisArg=this) {
		Map.#assertThis(this);
		MapUtils.assertFunction(callbackfn);

		this.forEach((k, v, map, i) => {
			if (!callbackfn.call(thisArg, k, v, map, i)) this.delete(k);
		});

		return this;
	}

	/*** Checker Methods ***/
	has(key) {
		Map.#assertThis(this);

		return super.has(key);
	}

	hasAll(...keys) {
		Map.#assertThis(this);

		return this.every(k => keys.includes(k));
	}

	hasAny(...keys) {
		Map.#assertThis(this);

		return this.some(k => keys.includes(k));
	}

	hasValue(...values) {
		return this.some((_, v) => values.includes(v));
	}

	/*** Data methods ***/
	keys() {
		Map.#assertThis(this);

		return [...super.keys()];
	}

	entries() {
		Map.#assertThis(this);

		return [...super.entries()];
	}

	entriesWithIndexes() {
		Map.#assertThis(this);

		return [...super.entries()].map(([k, v], i) => [k, v, i]);
	}


	values() {
		Map.#assertThis(this);

		return [...super.values()];
	}
	
	toEntryArray() {
		Map.#assertThis(this);

		return this.toArray((k, v) => new MapUtils.Entry(k, v));
	}

	/*** Utility Methods ***/
	clone(preserveLock = false) {
		Map.#assertThis(this);
		const newMap = new this.constructor();

		this.forEach((k, v) => newMap.set(k, v));
		if (preserveLock) newMap.lock();

		return newMap;
	}
	
	print() {
		Map.#assertThis(this);

		console.log(this);

		return this;
	}

	clear() {
		Map.#assertThis(this);
		this.#assertNotLocked();

		return super.clear(), this;
	}

	delete(key) {
		Map.#assertThis(this);
		this.#assertNotLocked();

		return super.delete(key);
	}

	deleteAll(...keys) {
		Map.#assertThis(this);
		this.#assertNotLocked();

		return keys.every(k => this.delete(k));
	}

	remove(key) {
		Map.#assertThis(this);
		this.#assertNotLocked();

		const v = this.get(key);

		this.delete(key);

		return v;
	}

	removeAll(...keys) {
		Map.#assertThis(this);

		return keys.map(key => this.remove(key));
	}

	lock() {
		Map.#assertThis(this);
		this.#assertNotLocked();
		this.#locked = true;

		return this;
	}

	setRequiredTypes({ key = Object, value = Object }) {
		if (this.#requiredValueType || this.#requiredKeyType) 
			throw new TypeError("Cannot re-declare required types of map");

		if (typeof key !== "function" || !key.prototype?.constructor)
			throw new TypeError("Map value assertion type must be a constructor");

		if (typeof value !== "function" || !value.prototype?.constructor)
			throw new TypeError("Map key assertion type must be a constructor");

		this.#requiredValueType = value;
		this.#requiredKeyType = key;
		this.#assertTypes = true;

		return this;
	}

	equals(otherMap) {
		Map.#assertThis(this);
		if (!otherMap instanceof this.constructor) return false;

		return this.every((k, v, _, i) => {
			const entry = otherMap.getEntryByIndex(i);

			if (!entry) return false;

			const [otherK, otherV] = entry;
			
			return k === otherK && v === otherV;
		});
	}

	swap() {
		const entries = this.entries();

		this.clear();

		entries.forEach(([k, v]) => {
			this.set(v, k);
		});

		return this;
	}

	slice(start = 0, end = this.size) {
		return this.clone().sliceWith(start, end);
	}

	sliceWith(start = 0, end = this.size) {
		const entries = this.entries();

		entries.forEach(([k], i) => {
			if (!(i >= start && i < end)) this.delete(k);
		});

		return this;
	}

	/*** Meta Properties ***/
	* [Symbol.iterator]() {
		Map.#assertThis(this);
		
		for (const [k, v] of super.entries()) yield [k, v];
	}

	[Symbol.species] = Map;
}