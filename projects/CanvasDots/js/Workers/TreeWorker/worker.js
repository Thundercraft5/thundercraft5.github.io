import MessageHandler from "../MessageHandler.js";
import { AbstractPoint, AbstractTree } from "../../DotTree/AbstractTree.js";
import { NullValueException, distance, drawOutArray, getRandomInt } from "../../utils.js";

const handler = new MessageHandler(self);

handler.addListeners({
 	"process"(command, {
		canvasHeight,
		canvasWidth,
		SAMPLE_SIZE,
		MAX_NODES,
		MAX_DIST,
		MIN_DIST,
		MAX_CHILDREN,
		MAX_DEPTH,
		CONSTANTS,
	 }) {
		let nodeCount = 0;
		const tree = new AbstractTree({
			pointSize: CONSTANTS.POINT_SIZE,
			maxChildren: MAX_CHILDREN,
			maxDepth: MAX_DEPTH,
		});

		tree.setCenter(canvasWidth / 2, canvasHeight / 2);

		outer: while (nodeCount < MAX_NODES) {
			const donePercentage = ((nodeCount + MAX_NODES)/MAX_NODES - 1) * 100;
			const candidates = [];

			for (let j = 0; j++ < SAMPLE_SIZE;) {
				const angle = getRandomInt(0, 360);
				const index = getRandomInt(0, tree.nodes.length-1);
				const node = tree.nodes[index];
				const dist = getRandomInt(MIN_DIST, MAX_DIST);
				const x = Math.clamp(dist * Math.sin(angle) + node.x, 0+CONSTANTS.MARGIN, canvasWidth-CONSTANTS.MARGIN);
				const y = Math.clamp(dist * Math.cos(angle) + node.y, 0+CONSTANTS.MARGIN, canvasHeight-CONSTANTS.MARGIN);
				const candidate = new AbstractPoint({ x, y });
				let closest;

				if (tree.nodes.length > 2)
					closest = drawOutArray(tree.nodes, 2).greatest((prev, cur) => distance(prev, candidate) >= distance(cur, candidate));
				else if (tree.nodes[1] && distance(tree.nodes[1], candidate) > distance(tree.nodes[0], candidate))
					[, closest] = tree.nodes;
				else
					[closest] = tree.nodes;

				// discard if parent node has reached it's limit
				if (!closest.childrenAmountInBounds || !closest.depthInBounds) continue outer;
				if (!node) throw new NullValueException("Node not found");

				if (closest) candidates.push({
					closest,
					node: candidate,
				});
				else throw new NullValueException(`Closest node not found: index ${ index }, node number ${ nodeCount }, candidate number: ${ j }`);
			}

			const { closest: parent, node } = candidates.greatest((prev, cur) => distance(prev.closest, prev.node) <= distance(cur.closest, cur.node));

			node.appendTo(parent);
			nodeCount++;
		}

		handler.send("process", tree);
 	},
});