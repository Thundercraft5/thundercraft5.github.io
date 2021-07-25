/* eslint-disable camelcase, require-jsdoc */
import './utils.js';

const y_initial = 8; // m
const x_initial = 0; // m

const angle = 45; // deg
const vel = 30; // m/s

const velocity_yInitial = vel * Math.sin(angle.toRadians()).round(2); // m/s
const velocity_xInitial = vel * Math.cos(angle.toRadians()).round(2); // m/s

$('.parabolicBall, .directionalArrow').css({
	bottom: (y_initial * 20) + 20,
	left: (x_initial * 20),
});

$('.directionalArrow').css({
	transform: `rotate(-${ angle }deg)`,
});

let ms = 0; // seconds

const $grid = $('table.grid');

for (let x = 0; ++x < +$grid.attr('data-x');) {
	const $row = $('<tr>', {
		'data-x': x,
	});

	for (let y = 0; ++y < +$grid.attr('data-x');) $row.append($('<td>', { 'data-y': y }));

	$grid.append($row);
}

function calculateY() {
	const time = ms/1000;

	return 1/2 * Math.G * time**2 + ((velocity_yInitial * time)) + y_initial;
}

function calculateX() {
	const time = ms/1000;

	return (velocity_xInitial * time) + x_initial;
}

function calculateXVelocity() {
	return velocity_xInitial + 0; 
}

function calculateYVelocity() {
	const time = ms/1000;

	return velocity_xInitial + time*Math.G; 
}	

const interval = 10;
const timeout = setInterval(frame, interval);

function frame() {
	/* x = velocity_xInitial * time */
	/* y = 1/2 * Gravity * time^2 + velocity_yInitial * time */
		
	const y = calculateY();
	const x = calculateX();

	if (y < 0) return clearInterval(timeout), $('.parabolicBall').css({ bottom: 0 });

	ms += interval;
	const [bottom, left] = [y*20, x*20];

	if (ms%100 === 0) $('<div>', {
		class: "positionMarker",
		css: { bottom: bottom + 20, left },
	}).appendTo('.gridWrapper');

	$('.parabolicBall').css({ bottom, left });
	$('.time').text(`Time elapsed: ${ (ms/1000).round(2) }s`);
	$('.height').text(`Height: ${ y.round(2) }m`);
	$('.dist').text(`Distance: ${ x.round(2) }m`);
	$('.vel-x').text(`X velocity: ${ calculateXVelocity().round(2) }m/s`);
	$('.vel-y').text(`Y velocity: ${ calculateYVelocity().round(2) }m/s`);
}