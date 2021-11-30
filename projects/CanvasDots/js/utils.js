export function getRandomInt(min = 0, max = Infinity) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class NullValueException extends Error {
	constructor(message = "") {
		super(message);

		this.name = NullValueException.name;
	}
}