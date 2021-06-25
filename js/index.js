import Map from "./Map.js";

const size = +$('.infectionTable').attr("data-size");

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

$('.infectionTableWrapper button.activateButton').on({ 
	click() {
		let growing = true;
		let occupiedTiles = new Map([[6, 7]]);
		let edgeTiles = new Map([[6, 8], [6, 6], [7, 7], [5, 7]]);
		const $wrapper = $(this).parents('.infectionTableWrapper');
		const $this = $(this);
		let count = 0;

		$this.attr({ "disabled": true });

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
			occupiedTiles = new Map([[6, 3]]);
			edgeTiles = new Map([[6, 4], [6, 2], [7, 3], [5, 3]]);
			growing = false;

			$wrapper.find(`td[data-x][data-y]`).removeClass('active');
			$this.attr({ "disabled": false });

			fill(6, 6);
			grow();
		}
		
		/**
		 * @internal
		 * @helper
		 */
		function checkOccupied(x, y) {
			return occupiedTiles.some((x1, y1) => x === x1 && y === y1);
		}

		/**
		 * @param {Map} map
		 * @param {Number} i
		 * @returns {[*, *]}
		 */
		function getMapEntryByIndex(map, i) {
			let res;
			
			map.forEach((k, v, _, c) => (c === i ? res = [k, v] : null));
			console.log(res);

			return res;
		}

		/**
		 * @internal
		 * @helper
		 */
		function getRandomInt(max) {
			return Math.ceil(Math.random() * max);
		}

		function checkIfOutOfBounds(...x, ...y) {
			
		};

		/**
		 * @internal
		 * @helper
		 */
		function addAvailableEdgeTiles(x, y) {
			if (x > 11 || y > 11 || y < 0 || x < 0) return;
			const [up, down, left, right] = [
				[x - 1, y],
				[x + 1, y],
				[x, y - 1],
				[x, y - 1],
			];

			// Edge
			if (!checkOccupied(x - 1, y)) edgeTiles.set(x - 1, y);
			if (!checkOccupied(x + 1, y)) edgeTiles.set(x + 1, y);
			if (!checkOccupied(x, y - 1)) edgeTiles.set(x, y - 1);
			if (!checkOccupied(x, y + 1)) edgeTiles.set(x, y + 1);
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
			if (!edgeTiles.size || !growing || count++ > 5) return;
			const index = getRandomInt(edgeTiles.size);
			const [x, y] = getMapEntryByIndex(edgeTiles, index);

			console.log(index);

			// Retry if tile grow fails or if x/y is out of bounds
			if (checkOccupied(x, y) || x > 11 || y > 11 || y < 0 || x < 0) return grow();

			fill(x, y);
			edgeTiles.delete(x);
			occupiedTiles.set(x, y);
			addAvailableEdgeTiles(x, y);
			setTimeout(() => grow(), 250);
		}

		fill(6, 7);
		grow();
	},
});

