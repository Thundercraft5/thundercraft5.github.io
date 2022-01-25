type ClassPrototype<T extends abstract new (...args: any[]) => any> = {
	[key in keyof InstanceType<T>]: (this: InstanceType<T>, ...args: any[]) => any | any;
};
type ValueOf<T> = T[keyof T];

interface ObjectConstructor {
	/**
	* Assigns methods to the prototype of the specified class. All methods added are non-enumerable.
	* @param {T} targetObject The class to add the methods to the prototype of.
	* @param {M} methods The methods to add to the prototype of the specified class.
	*/
	assignMethods<T extends abstract new (...args: any[]) => any, M extends { [key: keyof M]: (...args: any[]) => any }>(targetObject: T, methods: M & ThisType<InstanceType<T> & M>): ClassPrototype<T> & M;

	assign<T, U extends { [key in keyof T]: (this: T, ...args: any[]) => any }>(target: T, source: U): T & U;

	compose<T, K, V, This = T>(target: T, composeFunc: (this: This, key: keyof T, value: ValueOf<T>, self: T) => [keyof T | K, ValueOf<T> | V], thisArg: This): { [key in keyof T | K]: ValueOf<T> | V };

	keys<T>(target: T): Array<keyof T>;
	fromEntries<K, V>(entries: [K, V][]): { [key in K]: ValueOf<V> };
	entries<O>(target: O): [keyof O, ValueOf<O>][];
}

interface Array<T> {
	indexAt(index: number): number;
	removeByIndex(index: number): { key: index, value: T };
	remove(target: T): Array<T>;
	removeFrom(target: T): Array<T>;
	max(): number?;
	maxIndex(): number?;
	min(): number?;
	minIndex(): number?;
	greatest<This = Array<T>>(compareFn: (this: This, a: T, b: T, index: number, self: Array<T>) => boolean, thisArg: This): T?;
	greatestIndex<This = Array<T>>(compareFn: (this: This, a: T, b: T, index: number, self: Array<T>) => boolean, thisArg: This): number;
	clone(deep: boolean): Array<T>;
	clear(): Array<T>;
	toSet(): Set<T>;
	unique(): Array<T>;
	uniqueOf(): Array<T>;
	concatFrom(...items: Array<T> | T): Array<T>;
	replaceWith(otherArray: Array<T>): Array<T>;
	insert(index: number, ...items: T[]): Array<T>;
}

interface Math {
	clamp(value: number, min: number, max: number): number;
}