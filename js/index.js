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
		let occupiedTiles = new Map([[6, 6]]);
		let edgeTiles = new Map([[6, 5], [6, 7], [7, 6], [5, 6]]);
		const $wrapper = $(this).parents('.infectionTableWrapper');
		const $this = $(this);

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
			occupiedTiles = new Map([[6, 6]]);
			edgeTiles = new Map([[6, 5], [6, 7], [7, 6], [5, 6]]);
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
			let res, count = 0;
			
			map.forEach((k, v) => (count++ === i ? res = [k, v] : null));

			return res;
		}

		/**
		 * @internal
		 * @helper
		 */
		function getRandomInt(max) {
			return Math.floor(Math.random() * max);
		}

		/**
		 * @internal
		 * @helper
		 */
		function addAvailableEdgeTiles(x, y) {
			if (x > 11 || y > 11 || y < 0 || x < 0) return;

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
			if (!edgeTiles.size || !growing) return;
			const index = getRandomInt(edgeTiles.size);
			const [x, y] = getMapEntryByIndex(edgeTiles, index);

			console.log(edgeTiles, occupiedTiles);

			// Retry if tile grow fails or if x/y is out of bounds
			if (checkOccupied(x, y) || x > 11 || y > 11 || y < 0 || x < 0) return grow();

			fill(x, y);
			edgeTiles.delete(x);
			occupiedTiles.set(x, y);
			addAvailableEdgeTiles(x, y);
			setTimeout(() => grow(), 100);
		}

		fill(6, 6);
		grow();
	},
});

