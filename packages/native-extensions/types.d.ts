type ClassPrototype<T extends abstract new (...args: any[]) => any> = {
	[key in keyof InstanceType<T>]: (this: InstanceType<T>, ...args: any[]) => any | any;
};
type ValueOf<T> = T[keyof T];

type ObjectConstructor = {
	/**
	 * Assigns methods to the prototype of the specified class. All methods added are non-enumerable.
	 * @param {T} targetObject The class to add the methods to the prototype of.
	 * @param {M} methods The methods to add to the prototype of the specified class.
	 */
	assignMethods<T extends abstract new (...args: any[]) => any, M extends { [key: keyof M]: (...args: any[]) => any }>(targetObject: T, methods: M & ThisType<InstanceType<T> & M>): ClassPrototype<T> & M;

	assign<T, U extends { [key in keyof T]: (this: T, ...args: any[]) => any }>(target: T, source: U): T & U;

	compose<T, K, V, This = T>(target: T, composeFunc: (this: This, key: keyof T, value: ValueOf<T>, self: T) => [keyof T | K, ValueOf<T> | V], thisArg: This): { [key in keyof T | K]: ValueOf<T> | V };

	keys<T>(target: T): (keyof T)[];
	fromEntries<K, V>(entries: [K, V][]): { [key in K]: ValueOf<V> };
	entries<O>(target: O): [keyof O, ValueOf<O>][];
};

type Array<T> = {
	indexAt(index: number): number;
	removeByIndex(index: number): { key: index; value: T };
	remove(target: T): T[];
	removeFrom(target: T): T[];
	max(): number?;
	maxIndex(): number?;
	min(): number?;
	minIndex(): number?;
	greatest<This = T[]>(compareFn: (this: This, a: T, b: T, index: number, self: T[]) => boolean, thisArg: This): T?;
	greatestIndex<This = T[]>(compareFn: (this: This, a: T, b: T, index: number, self: T[]) => boolean, thisArg: This): number;
	clone(deep: boolean): T[];
	clear(): T[];
	toSet(): Set<T>;
	unique(): T[];
	uniqueOf(): T[];
	concatFrom(...items: T[] | T): T[];
	replaceWith(otherArray: T[]): T[];
	insert(index: number, ...items: T[]): T[];
};

type Math = {
	clamp(value: number, min: number, max: number): number;
};
