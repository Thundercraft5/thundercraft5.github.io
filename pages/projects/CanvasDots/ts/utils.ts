/* eslint-disable import/exports-last */
import makeErrors from "@thundercraft5/node-errors";


/**
 * @typedef {import("./DotTree/index.js").Point} Point
 * @typedef {import("./DotTree/index.js").Canvas} Canvas
 * @typedef {import("./DotTree/index.js").Tree} Tree
 */
export function getRandomInt(min = 0, max = Infinity) {
	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getArgumentSignature(args: unknown[]): unknown[] {
	return [...args].map((v: any) => v.__proto__.constructor);
}

export function stretchArray(arr: unknown[] = [], mult = 1) {
	for (let i = -1; i++; i < mult) {
		console.log(i);

		for (const [i, value] of [...arr].entries())
			arr.splice(i, 0, value);
	}

	return arr;
}
export function distance(a: { x: number, y: number }, b: { x: number, y: number }) {
	const dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt(dx ** 2 + dy ** 2);
}
export function* iter(size: number) {
	for (let i = 0; i++ < size;)
		yield i;
}
export function drawOutArray(arr: unknown[], size = 1) {
	const ret = [];

	for (const i of iter(arr.length))
		for (const _ of iter(size))
			ret.push(arr[i - 1]);


	return ret;
}

const {
	NullValueException,
	TreeException,
	TreeNodeException,
	NodeDepthOutOfBoundsException,
	TooManyChildNodesException,
	DuplicateNodeException
} = makeErrors({
	NullValueException: {
		DEFAULT: (message = "Value provided is null.") => message
	},
	TreeException: {
		DEFAULT: (tree) => "" + (tree ? `Tree Info: ${JSON.stringify(tree)}` : "No tree information provided."),
		"NO_ROOT": () => "The tree has no root node.",
		"NO_TREE": () => "This point has no given tree.",
		"NODE_NOT_FOUND": (x, y) => `No node found at coordinates (${x}, ${y}). Check that the coordinates are correct.`
	},
	TreeNodeException: {
		DEFAULT: (node) => "" + (node ? `Node Info: ${JSON.stringify(node)}` : "No node information provided.")
	},
	NodeDepthOutOfBoundsException: {
		DEFAULT: (tree) => `The added node exceeds the maximum depth specified by the parent tree (which is "${tree?.maxDepth}").`
	},
	TooManyChildNodesException: {
		DEFAULT: (parentNode, tree) => `The added node exceeds the maximum number of child nodes specified by the parent node or tree (which is "${parentNode?.maxChildren && parentNode?.maxChildren !== Infinity ? parentNode.maxChildren : tree?.maxChildren
			}")`
	},
	DuplicateNodeException: {
		DEFAULT: () => "The added node is already in the parent's child node list."
	}
}, {
	NullValueException: class NullValueException extends Error { },
	TreeException: class TreeException extends Error { },
	TreeNodeException: class TreeNodeException extends Error { },
	NodeDepthOutOfBoundsException: class NodeDepthOutOfBoundsException extends Error { },
	TooManyChildNodesException: class TooManyChildNodesException extends Error { },
	DuplicateNodeException: class DuplicateNodeException extends Error { }
});

export {
	NullValueException,
	TreeException,
	TreeNodeException,
	NodeDepthOutOfBoundsException,
	TooManyChildNodesException,
	DuplicateNodeException
};