// import "native-extensions";

import { AbstractPoint, AbstractTree } from "./DotTree/AbstractTree.js";
import type { Point } from "../types.ts";
// import { webcrypto as crypto } from "crypto";

const tree = new AbstractTree();

// Test tree cloning/traversal
tree.root.append(new AbstractPoint({ x: 2, y: 2 }));
tree.root.append(new AbstractPoint({ x: 5, y: 5 }));
tree.root.append(new AbstractPoint({ x: 8, y: 8 }));
tree!.nodes[1].append(new AbstractPoint({ x: 3, y: 3 }));
console.log(tree.clone().traverse(console.log));

// Test tree node distance sorting with fake data
function distance(a: Point, b: Point) {
	const dx = a.x - b.x,
		dy = a.y - b.y;

	return Math.sqrt(dx ** 2 + dy ** 2);
}

const arr = [...new Array(100)].map(() => crypto.getRandomValues(new Uint8Array(2)))
	.map(([x, y]) => ({ x, y })),
	target = arr.shift();

arr.sort((a, b) => {
	a = distance(target, a);
	b = distance(target, b);

	if (a < b) return -1;
	if (a == b) return 0;
	if (a > b) return 1;
});
console.log(distance(target, arr[0]));