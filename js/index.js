import Map from "../node_modules/extended-map/Map.js";

const size = +$('.infectionTable').attr("data-size");
const center = Math.ceil(size/2);
		
for (let i = 0; i++ < size;) {
	const $row = $('<tr>', {
		"data-y": i,
	});

	for (let j = 0; j++ < size;) 
		$row.append($('<td>', {
			"data-active": false,
			"data-y": i,
			"data-x": j,
		}));
	
	$('.infectionTable').append($row);
}

/**
 * @param {Number} time - the time to wait
 * @return {JQuery.Deferred<void>} A promise that with a delay of `time`
 */
function wait(time) {
	return new $.Deferred(def => setTimeout(() => def.resolve(), time));
}

const startEdgeTiles = new Map(			
	[center, center+1], 
	[center, center-1], 
	[center-1, center],
	[center+1, center],
);

$('.infectionTableWrapper button.activateButton').on({ 
	async click() {
		let growing = true;
		let occupiedTiles = new Map([center, center]);
		let edgeTiles = startEdgeTiles.clone();
		const upperBounds = new Map.Entry(size, size);
		const lowerBounds = new Map.Entry(0, 0);

		const $wrapper = $(this).parents('.infectionTableWrapper');
		const $this = $(this);

		$this.attr({ "disabled": true });
		$('.resetButton').click(() => {
			reset();
		});

		/**
		 * @internal
		 * @helper
		 */
		function fill(x, y) {
			return $wrapper.find(`td[data-x="${ x }"][data-y="${ y }"]`).addClass('active');
		}

		/**
		 * @internal
		 * @helper
		 */
		function reset() {
			occupiedTiles = new Map([center, center]);
			edgeTiles = startEdgeTiles.clone();
			growing = false;

			$wrapper.find(`td[data-x][data-y]`).removeClass('active');
			$this.attr({ disabled: false });

			fill(center, center);
			grow();
		}
		
		/**
		 * @internal
		 * @helper
		 */
		function checkOccupied(entry) {
			return occupiedTiles.hasEntry(entry);
		}

		/**
		 * @internal
		 * @helper
		 * @param {Map.Entry} entry - The entry to object to check for
		 */
		function checkIfOutOfBounds(entry) {
			return entry.lessThan(upperBounds) && entry.greaterThan(lowerBounds);
		}

		/**
		 * @internal
		 * @helper
		 */
		function addAvailableEdgeTiles(x, y) {
			if (x > size || y > size || y < 0 || x < 0) return;
			const [up, down, left, right] = [
				new Map.Entry(x, y + 1),
				new Map.Entry(x, y - 1),
				new Map.Entry(x - 1, y),
				new Map.Entry(x + 1, y),
			];

			// Edge
			if (!checkOccupied(up) && checkIfOutOfBounds(up)) 
				console.log(edgeTiles.has(up)),
				edgeTiles.set(up), 
				console.log("up");
			if (!checkOccupied(down) && checkIfOutOfBounds(down)) 
				console.log(edgeTiles.has(down)),
				edgeTiles.set(down), 
				console.log("down");
			if (!checkOccupied(left) && checkIfOutOfBounds(left)) 
				console.log(edgeTiles.has(left)), 
				edgeTiles.set(left), 
				console.log("left");
			if (!checkOccupied(right) && checkIfOutOfBounds(right)) 
				console.log(edgeTiles.has(right)),
				edgeTiles.set(right), 
				console.log("right");
			/* 
			// Corner
			if (!checkOccupied(x - 1, y - 1)) edgeTiles.set(x - 1, y - 1);
			if (!checkOccupied(x + 1, y - 1)) edgeTiles.set(x + 1, y - 1);
			if (!checkOccupied(x - 1, y + 1)) edgeTiles.set(x - 1, y + 1);
			if (!checkOccupied(x + 1, y + 1)) edgeTiles.set(x + 1, y + 1); */
		}

		/**
		 * @internal
		 * @helper
		 */
		function grow() {
			if (!edgeTiles.size || !growing) return;
			const entry = edgeTiles.randomEntry();
			const [x, y] = entry;

			console.log(x, y);
			// Retry if tile grow fails or if x/y is out of bounds
			if (checkOccupied(entry) || x > size || y > size || y < 0 || x < 0) return;
			addTile(x, y);
		}

		/**
		 * @internal
		 * @helper
		 */
		async function addTile(x, y) {
			fill(x, y);
			edgeTiles.delete(x);
			occupiedTiles.set(x, y);
			addAvailableEdgeTiles(x, y);
			await wait(250);
			grow();
		}

		fill(center, center);
		grow();

		for (let i = 0; i++ < 1000000;) {
			if (!edgeTiles.size || !growing) return;
			const entry = edgeTiles.randomEntry();
			const [x, y] = entry;

			// Retry if tile grow fails or if x/y is out of bounds
			if (checkOccupied(entry) || x > size || y > size || y < 0 || x < 0) continue;
			await addTile(x, y);
		}
	},
});