export function getRandomInt(min: number = 0, max: number = Infinity): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx ** 2 + dy ** 2);
}

export function shiftToPositive(n: number): number {
	if (n >= 0) return n;
	return Math.abs(n * 2);
}

export function isIterable(value: any): value is Iterable<any> {
	return typeof value?.[Symbol.iterator] === "function";
}
