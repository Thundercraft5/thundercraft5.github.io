export function getRandomInt(min = 0, max = Infinity) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function distance(a, b) {
	const dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt(dx**2 + dy**2);
}

// Shift negative numbers to positive
export function shiftToPositive(n) {
	if (n >= 0) return n;

	return Math.abs(n*2);
}

export function isIterable(value) {
	return typeof value?.[Symbol.iterator] === "function";
}