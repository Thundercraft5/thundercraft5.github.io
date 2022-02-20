/** 
 * @typedef {{
 *  shadowstyle?: string;
 *  shadowBlur?: number;
 *  shadowOffsetX?: number;
 *  shadowOffsetY?: number;
 *  lineDashOffset?: number;
 *  lineJoin?: CanvasLineJoin;
 *  lineWidth?: number;
 *  lineDash?: number[];
 *  style?: string | CanvasGradient | CanvasPattern;
 *  filter?: string;
 *  miterLimit?: number;
 * }} CanvasStrokeOptions
 */
export default class Canvas {
	static PIXEL_RATIO = (() => {
		const ctx = document.createElement("canvas").getContext("2d"),
			dpr = window.devicePixelRatio || 1,
			bsr = ctx.webkitBackingStorePixelRatio
			|| ctx.mozBackingStorePixelRatio
			|| ctx.msBackingStorePixelRatio
			|| ctx.oBackingStorePixelRatio
			|| ctx.backingStorePixelRatio || 1;

		return dpr / bsr;
	})();

	width = 1000;
	height = 1000;
	element = null;
	/**
	 * @type {CanvasRenderingContext2D}
	 * @property
	 */
	context = null;

	constructor({
		height = 1000,
		width = 1000,
		element = document.createElement("canvas"),
		attrs = {},
	} = {}) {
		const ratio = Canvas.PIXEL_RATIO;

		Object.assign(this, {
			height,
			width,
			element,
			context: element.getContext("2d"),
		});

		Object.assign(element, attrs);
		element.width = width * ratio;
		element.height = height * ratio;
		element.style.width = `${ width }px`;
		element.style.height = `${ height }px`;
		this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
	}

	fillCircle(style = "#000", x = 0, y = 0, radius = 1) {
		this.setFill({ style })
			.beginPath()
			.arc(x, y, radius, 0, 2 * Math.PI, false)
			.fill();

		return this;
	}

	fillRect(style = "#000", x = 0, y = 0, width = 1, height = 1) {
		this.setFill({ style });
		this.context.fillRect(x, y, width, height);

		return this;
	}

	fillLine(x0 = 0, y0 = 0, x1 = 0, y1 = 0, style = "#000000", width = this.context.lineWidth || 1) {
		const oldWidth = this.context.lineWidth;
		const oldStyle = this.context.style;

		this.beginPath()
			.setStroke({ lineWidth: width, style })
			.moveTo(x0, y0)
			.lineTo(x1, y1)
			.stroke()
			.setStroke({ lineWidth: oldWidth, style: oldStyle });

		return this;
	}

	/**
	 * @param {CanvasStrokeOptions} strokeOptions
	 */
	strokeRect(style = "#000", x = 0, y = 0, width = 1, height = 1, strokeOptions = {}) {
		this.setStroke({ ...strokeOptions, style });
		this.context.strokeRect(x, y, width, height);

		return this;
	}

	/**
	 * @param {CanvasStrokeOptions} strokeOptions
	 */
	strokeCircle(style = "#000", x = 0, y = 0, radius = 1, strokeOptions = {}) {
		this.setStroke({ ...strokeOptions, style });
		this.beginPath();
		this.arc(x, y, radius, 0, Math.PI * 2);
		this.stroke();

		return this;
	}

	clearRect(x = 0, y = 0, width = 1, height = 1) {
		this.context.clearRect(x, y, width, height);

		return this;
	}

	clearCircle(x = 0, y = 0, radius = 1) {
		this.setCompositeOperation("destination-out");
		this.arc(x, y, radius);
		this.fill();
		this.setCompositeOperation();
	}

	clear() {
		this.clearRect(0, 0, this.width, this.height);
	}

	setCompositeOperation(op = "source-over") {
		this.context.globalCompositeOperation = op;

		return this;
	}

	setFill({
		style = this.context.fillStyle,
	} = {}) {
		this.context.fillStyle = style;

		return this;
	}

	/**
	 *@param {CanvasStrokeOptions} strokeOptions
	 */
	setStroke({
		shadowstyle = this.context.shadowstyle,
		shadowBlur = this.context.shadowBlur,
		shadowOffsetX = this.context.shadowOffsetX,
		shadowOffsetY = this.context.shadowOffsetY,
		lineDashOffset = this.context.lineDashOffset,
		lineJoin = this.context.lineJoin,
		lineCap = this.context.lineCap,
		lineWidth = this.context.lineWidth,
		lineDash = this.context.getLineDash(),
		style = this.context.strokeStyle,
		filter = this.context.filter,
		miterLimit = this.context.miterLimit,
	} = {}) {
		Object.assign(this.context, {
			shadowstyle,
			shadowBlur,
			shadowOffsetX,
			shadowOffsetY,
			lineDashOffset,
			lineJoin,
			lineCap,
			lineWidth,
			strokeStyle: style,
			filter,
			miterLimit,
		});

		this.context.setLineDash(lineDash);

		return this;
	}

	setTextStyle({
		align = this.context.textAlign,
		baseline = this.context.textBaseline,
	} = {}) {
		Object.assign(this.context, {
			textAlign: align,
			textBaseline: baseline,
		});

		return this;
	}

	arc(x = 0, y = 0, radius = 1, startAngle = 0, endAngle = Math.PI * 2, counterclockwise = false) {
		this.context.arc(x, y, radius, startAngle, endAngle, counterclockwise);

		return this;
	}

	arcTo(x1 = 0, y1 = 0, x2 = 0, y2 = 0, radius = 1) {
		this.context.arcTo(x1, y1, x2, y2, radius);

		return this;
	}

	beginPath() {
		this.context.beginPath();

		return this;
	}

	bezierCurveTo(cp1x = 0, cp1y = 0, cp2x = 0, cp2y = 0, x = 0, y = 0) {
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

		return this;
	}

	clip(path, fillRule = "nonzero") {
		switch (arguments.length) {
			case 0: this.context.clip(fillRule); break;
			default: this.context.clip(...arguments); // eslint-disable-line
		}

		return this;
	}

	closePath() {
		this.context.closePath();

		return this;
	}

	createImageData(...data) {
		return this.context.createImageData(...data);
	}

	createLinearGradient(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
		return this.context.createLinearGradient(x0, y0, x1, y1);
	}

	createPattern(image, repetition) {
		return this.context.createPattern(image, repetition);
	}

	createRadialGradient(x0 = 0, y0 = 0, r0 = 0, x1 = 0, y1 = 0, r1 = 0) {
		return this.context.createRadialGradient(x0, y0, r0, x1, y1, r1);
	}

	drawFocusIfNeeded(path, element) {
		this.context.drawFocusIfNeeded(path, element);

		return this;
	}

	drawImage(...data) {
		this.context.drawImage(...data);

		return this;
	}

	ellipse(
		x = 0,
		y = 0,
		radiusX = 1,
		radiusY = 1,
		rotation = 0,
		startAngle = 0,
		endAngle = Math.PI * 2,
		counterclockwise = false,
	) {
		this.context.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);

		return this;
	}

	fill(...data) {
		this.context.fill(...data);

		return this;
	}

	fillText(text = "", x = 0, y = 0, mathWidth = Infinity) {
		this.context.fillText(text, x, y, mathWidth);

		return this;
	}

	getContextAttributes() {
		return this.context.getContextAttributes();
	}

	getImageData(sx = 0, sy = 0, sw = 1, sh = 1, settings = {}) {
		return this.context.getImageData(sx, sy, sw, sh, settings);
	}

	getLineDash() {
		return this.context.getLineDash();
	}

	setLineDash(segments = []) {
		this.context.setLineDash(segments);

		return this;
	}

	resetLineDash() {
		this.context.setLineDash([]);

		return this;
	}

	getTransform() {
		return this.context.getTransform();
	}

	isPointInPath(...data) {
		return this.context.isPointInPath(...data);
	}

	isPointInStroke(...data) {
		return this.context.isPointInPath(...data);
	}

	lineTo(x = 0, y = 0) {
		this.context.lineTo(x, y);

		return this;
	}

	measureText(text = "") {
		return this.context.measureText(text);
	}

	moveTo(x = 0, y = 0) {
		this.context.moveTo(x, y);

		return this;
	}


	/**
	 * @param {ImageData} [imageData=null]
	 * @param {number} [dx=0]
	 * @param {number} [dy=0]
	 * @param {number} [dirtyX=0]
	 * @param {number} [dirtyY=0]
	 * @param {number} [dirtyWidth=imageData.height]
	 * @param {number} [dirtyHeight=imageData.width]
	 * @return {*} 
	 * @memberof Canvas
	 */
	putImageData(
		imageData = null,
		dx = 0,
		dy = 0,
		dirtyX = 0,
		dirtyY = 0,
		dirtyWidth = imageData.height,
		dirtyHeight = imageData.width,
	) {
		this.context.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);

		return this;
	}

	quadraticCurveTo(cpx = 0, cpy = 0, x = 0, y = 0) {
		this.context.quadraticCurveTo(cpx, cpy, x, y);

		return this;
	}

	rect(x = 0, y = 0, width = 1, height = 1) {
		this.context.rect(x, y, width, height);

		return this;
	}

	resetTransform() {
		this.context.resetTransform();

		return this;
	}

	restore() {
		this.context.restore();

		return this;
	}

	rotate(angle = 0) {
		this.context.rotate(angle);

		return this;
	}

	save() {
		this.context.save();

		return this;
	}

	scale(x = 1, y = 1) {
		this.context.scale(x, y);

		return this;
	}

	scrollPathIntoView(path = null) {
		this.context.scrollPathIntoView();

		return this;
	}

	setTransform(...data) {
		this.context.setTransform(...data);

		return this;
	}

	stroke(path = null) {
		// eslint-disable-next-line prefer-rest-params
		this.context.stroke(...[...arguments].filter(Boolean));

		return this;
	}

	strokeText(text = "", x = 0, y = 0, maxWidth = Infinity) {
		this.context.strokeText(text, x, y, maxWidth);

		return this;
	}

	transform(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0) {
		this.context.transform(a, b, c, d, e, f);

		return this;
	}

	translate(x = 0, y = 0) {
		this.context.translate(x, y);

		return this;
	}

	attach(selector = "body") {
		document.querySelector(selector)?.appendChild(this.element);

		return this;
	}

	attr(attrs = {}) {
		Object.assign(this.element, attrs);

		return this;
	}

	detach() {
		this.element.remove();

		return this;
	}
}