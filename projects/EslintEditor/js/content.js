import { Test } from "./test";
import { add } from "math";

new Test().test();

export function getRandomInt(min = 0, max = Infinity) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getArgumentSignature(args) {
	return [...args].map(v => Object.getPrototypeOf(args).constructor);
}

export function stretchArray(arr = [], mult = 1) {
	for (let i = -1; i++; i < mult) {
		console.log(i);

		for (const [i, value] of arr.clone().entries())
			arr.insert(i, value);
	}

	return arr;
}

export function distance(a, b) {
	const dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt(dx**2 + dy**2);
}

export function* iter(size) {
	for (let i = 0; i++ < size;)
		yield i;
}

export function drawOutArray(arr, size = 1) {
	const ret = [];

	for (const i of iter(arr.length))
		for (const _ of iter(size)) ret.push(arr[i-1]);


	return ret;
}

class Exception extends Error {
	constructor(message = "") {
		super(message);
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
	/** @type {Test} */
	tree = null;
	constructor(/** @type {Test} */ tree = null) {
		super();
		this.tree = tree;
	}
}

/** @internal */
export class TreeNodeException extends TreeException {
	/** @type {Test} */
	node = null;

	constructor(/** @type {Test} */ node = null) {
		super(node?.tree);
	}
}

/** @internal */
export class NodeDepthOutOfBoundsException extends TreeNodeException {
	constructor(/** @type {Test} */ node = null) {
		super(node);

		this.message = `The added node exceeds the maximum depth specified by the parent tree (which is "${ this.tree.maxDepth }").`;
	}
}

/** @internal */
export class TooManyChildNodesException extends TreeNodeException {
	/** @type {Test} */
	parentNode = null;

	constructor(/** @type {Test} */ point, /** @type {Test} */ parentNode = null) {
		super(parentNode);
		console.log(parentNode.tree);

		this.parentNode = parentNode;
		this.message = `The added node exceeds the maximum number of child nodes specified by the parent node or tree (which is "${
			parentNode?.maxChildren && parentNode?.maxChildren !== Infinity ? parent.maxChildren : this.tree.maxChildren
		}")`;
	}
}

export class DuplicateNodeException extends TreeNodeException {
	/** @type {Test} parentNode */
	parentNode = null;

	constructor(/** @type {Test} */ point) {
		super(point);
		this.parentNode = point.parentNode;
		this.message = "The added node is already in the parent's child node list.";
	}
}