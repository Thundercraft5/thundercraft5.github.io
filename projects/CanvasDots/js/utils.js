/**
 * @typedef {import("./DotTree").Point} Point
 * @typedef {import("./DotTree").Canvas} Canvas
 * @typedef {import("./DotTree").Tree} Tree
 */

export function getRandomInt(min = 0, max = Infinity) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getArgumentSignature(args) {
	return Array.from(args).map(v => v.__proto__.constructor);
}

class Exception extends Error {
	constructor(message = "") {
		super(message);
		this.message = message;
		this.name = this.constructor.name;
	}
}

export class NullValueException extends Exception {
	constructor(message = "Value provided is null.") {
		super(message);
	}
}

/** @internal */
export class TreeException extends Exception {
	/** @type {Tree} */
	tree = null;
	constructor(/** @type {Tree} */ tree = null) {
		super();
		this.tree = tree;
	}
}

/** @internal */
export class TreeNodeException extends TreeException {
	/** @type {Point} */
	node = null;

	constructor(/** @type {Point} */ node = null) {
		super(node?.tree);
	}
}

/** @internal */
export class NodeDepthOutOfBoundsException extends TreeNodeException {
	constructor(/** @type {Point} */ node = null) {
		super(node);

		this.message = `The added node exceeds the maximum depth specified by the parent tree (which is "${ this.tree.maxDepth }").`;
	}
}

/** @internal */
export class TooManyChildNodesException extends TreeNodeException {
	/** @type {Point} */
	parentNode = null;

	constructor(/** @type {Point} */ point, /** @type {Point} */ parentNode = null) {
		super(parentNode);
		console.log(parentNode.tree);

		this.parentNode = parentNode;
		this.message = `The added node exceeds the maximum depth specified by the parent node or tree (which is "${ parentNode?.maxChildren || this.tree.maxChildren }")`;
	}
}