/* eslint-disable camelcase */
import "./utils.js";

/**
 * drag
 * 
 * `vtot = Math.sqrt(vx**2, vy**2)`
 * `angle = tan^-1(vx/vy)` // Include extra -1 to account for reverse
 * 
 * Update `calculateX()` and `calculateY()` to include drag	
 */

$(".input-wrapper label").each(function() {
	const $this = $(this);

	$this.next().attr("placeholder", $this.text());
	$this.parent().attr("title", $this.text());
});

const prevInputs = JSON.parse(localStorage.getItem("CannonBallProject-prevInputs"));
const $grid = $("table.grid");

for (let x = 0; ++x < +$grid.attr("data-x");) {
	const $row = $("<tr>", { "data-x": x });

	for (let y = 0; ++y < +$grid.attr("data-x");) $row.append($("<td>", { "data-y": y }));

	$grid.append($row);
}

let intervalId, paused;const $canvas = $(".markerCanvas");
const ctx = $canvas[0].getContext("2d");const canvasHeight = $canvas.height()*3;
const canvasWidth = $canvas.width()*3;const boxWidth = $canvas.width();
const boxHeight = $canvas.height();

$canvas.attr("width", canvasWidth);
$canvas.attr("height", canvasHeight);
ctx.fillStyle = "rgba(0, 0, 0, 1)";

const [
	$startingHeight,
	$angle,
	$speed,
	$bounciness,
	$mass,
	$drag,
] = "#starting-height-input, #angle-input, #speed-input, #bounciness-input, #mass-input, #drag-input"
	.split(/\s*,\s*/)
	.map($.bindParamsLimit(1));

function clearCanvas() {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

if (prevInputs) {
	$startingHeight.val(prevInputs.startingHeight);
	$angle.val(prevInputs.angle);
	$speed.val(prevInputs.speed);
	$bounciness.val(prevInputs.bounciness);
}

let y_initial, x_initial,
	angle, speed, bounciness,
	velocity_x, velocity_y,
	global_y, global_x, ms,
	drag, mass, dragAcceleration,
	drag_velocity_y, drag_velocity_x;

function start() {
	if (paused)
		paused = !paused;
	else {
		y_initial = +$startingHeight.val(); // m
		x_initial = 0; // m

		angle = +$angle.val(); // deg
		speed = +$speed.val(); // m/s
		mass = +$mass.val(); // kg
		drag = +$drag.val();
		bounciness = +$bounciness.val();

		velocity_y = speed * Math.sin(angle.toRadians()).round(2); // m/s
		velocity_x = speed * Math.cos(angle.toRadians()).round(2); // m/s

		$(".parabolicBall, .directionalArrow").css({
			bottom: y_initial * 20 + 20,
			left: x_initial * 20,
		});

		$(".directionalArrow").css({ transform: `rotate(-${ angle }deg)` });

		ms = 0; // seconds
		global_y = y_initial;
		global_x = 0;

		localStorage.setItem("CannonBallProject-prevInputs", JSON.stringify({
			speed,
			angle,
			bounciness,
			startingHeight: y_initial,
		}));
	}

	const interval = 5;

	intervalId = setInterval(frame, interval);

	function calculateY(y2) {
		const time = interval/1000;

		global_y = 1/2 * (Math.G + drag_velocity_y) * time**2 + velocity_y * time + y2;

		return global_y;
	}

	function calculateX(x2) {
		const time = interval/1000;

		global_x = 1/2 * drag_velocity_x * time**2 + velocity_x * time + x2;

		return global_x;
	}

	function calculateXVelocity() {
		const time = interval/1000;

		return velocity_x + time*drag_velocity_x;
	}

	function calculateYVelocity() {
		const time = interval/1000;

		return velocity_y+time * (Math.G + drag_velocity_y);
	}

	function calculateDrag() {
		let angle = Math.atan(velocity_y/velocity_x);
		const vtot = Math.sqrt(velocity_x**2 + velocity_y**2);

		if (velocity_x < 0) angle -= Math.PI;

		dragAcceleration = -drag * vtot / mass;
		drag_velocity_y = dragAcceleration * Math.sin(angle).round(2); // m/s
		drag_velocity_x = dragAcceleration * Math.cos(angle).round(2); // m/s
	}


	function frame() {
		calculateDrag();

		velocity_x = calculateXVelocity();
		velocity_y = calculateYVelocity();

		let y = calculateY(global_y);
		let x = calculateX(global_x);

		if (y < 0.05) {
			velocity_y = -velocity_y*bounciness;
			y = 0.1;
		} else if (y*20 > boxHeight) {
			velocity_y = -velocity_y*bounciness;
			y = 0.5;
		}

		if (x*20 > boxWidth) {
			velocity_x = -velocity_x*bounciness;
			x = boxWidth-0.1;
		} else if (x < 0.05 && ms/1000 > 1) {
			x = 0.1;
			velocity_x = -velocity_x*bounciness;
		}

		ms += interval;
		const [bottom, left] = [y*20, x*20];

		ctx.fillRect(left*3, canvasHeight-(bottom+20)*3, 4, 4);
		$(".parabolicBall").css({ bottom, left });
		$(".time").text(`Time elapsed: ${ (ms/1000).round(2) }s`);
		$(".height").text(`Height: ${ y.round(2) }m`);
		$(".dist").text(`Distance: ${ x.round(2) }m`);
		$(".vel-x").text(`X velocity: ${ calculateXVelocity().round(2) }m/s`);
		$(".vel-y").text(`Y velocity: ${ calculateYVelocity().round(2) }m/s`);
		$(".drag-x").text(`Drag X: ${ drag_velocity_x.round(2) }m/s`);
		$(".drag-y").text(`Drag Y: ${ drag_velocity_y.round(2) }m/s`);
	}
}

function reset() {
	$(".parabolicBall, .directionalArrow").css({
		bottom: 0,
		left: 0,
	});

	$(".directionalArrow").css({ transform: "none" });

	clearCanvas();
	clearInterval(intervalId);

	y_initial =
		x_initial =
		angle =
		speed =
		bounciness =
		velocity_x =
		velocity_y =
		ms =
		global_y =
		global_x =
		0;
}

function pause() {
	paused = true;

	clearInterval(intervalId);
}

$("#start-button").click(start);
$("#reset-button").click(reset);
$("#stop-button").click(pause);