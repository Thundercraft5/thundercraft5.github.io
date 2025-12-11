export type CanvasStrokeOptions = {
	shadowColor?: string;
	shadowBlur?: number;
	shadowOffsetX?: number;
	shadowOffsetY?: number;
	lineDashOffset?: number;
	lineJoin?: CanvasLineJoin;
	lineWidth?: number;
	lineDash?: number[];
	style?: string | CanvasGradient | CanvasPattern;
	filter?: string;
	miterLimit?: number;
	lineCap?: CanvasLineCap;
}
export default class Canvas {
	#PIXEL_RATIO = (() => {
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

	renderContext: CanvasRenderingContext2D;

	constructor({
		height = 1000,
		width = 1000,
		element = document.createElement("canvas"),
		attrs = {},
		...props
	}: { height?: number, width?: number, element?: HTMLCanvasElement, attrs?: Record<string, any> } = {}) {
		const ratio = this.#PIXEL_RATIO;

		Object.assign(this, {
			height,
			width,
			element,
			renderContext: element.getContext("2d"),
		});

		Object.assign(element, attrs);
		element.width = width * ratio;
		element.height = height * ratio;
		element.style.width = `${ width }px`;
		element.style.height = `${ height }px`;
		this.renderContext.setTransform(ratio, 0, 0, ratio, 0, 0);
	}

	fillCircle(color = "#000", x = 0, y = 0, radius = 1) {
		this.setFill({ color })
			.beginPath()
			.arc(x, y, radius, 0, 2 * Math.PI, false)
			.fill();

		return this;
	}

	fillRect(color = "#000", x = 0, y = 0, width = 1, height = 1) {
		this.setFill({ color });
		this.renderContext.fillRect(x, y, width, height);

		return this;
	}

	fillLine(x0 = 0, y0 = 0, x1 = 0, y1 = 0, color = "#000000") {
		this.setFill({ color })
			.beginPath()
			.moveTo(x0, y0)
			.lineTo(x1, y1)
			.stroke();

		return this;
	}

	strokeRect(color = "#000", x = 0, y = 0, width = 1, height = 1, strokeOptions: CanvasStrokeOptions = {}) {
		this.setStroke({ ...strokeOptions, style: color });
		this.renderContext.strokeRect(x, y, width, height);

		return this;
	}

	strokeCircle(color = "#000", x = 0, y = 0, radius = 1, strokeOptions: CanvasStrokeOptions = {}) {
		this.setStroke({ ...strokeOptions, style: color });
		this.beginPath();
		this.arc(x, y, radius, 0, Math.PI * 2);
		this.stroke();

		return this;
	}

	clearRect(x = 0, y = 0, width = 1, height = 1) {
		this.renderContext.clearRect(x, y, width, height);

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

	setCompositeOperation(op: GlobalCompositeOperation = "source-over") {
		this.renderContext.globalCompositeOperation = op;

		return this;
	}

	setFill({
		color = this.renderContext.fillStyle,
	} = {}) {
		Object.assign(this.renderContext, {
			fillStyle: color,
		});

		return this;
	}

	/**
	 *@param {CanvasStrokeOptions} strokeOptions
	 */
	setStroke({
		shadowColor = this.renderContext.shadowColor,
		shadowBlur = this.renderContext.shadowBlur,
		shadowOffsetX = this.renderContext.shadowOffsetX,
		shadowOffsetY = this.renderContext.shadowOffsetY,
		lineDashOffset = this.renderContext.lineDashOffset,
		lineJoin = this.renderContext.lineJoin,
		lineCap = this.renderContext.lineCap,
		lineWidth = this.renderContext.lineWidth,
		lineDash = this.renderContext.getLineDash(),
		style = this.renderContext.strokeStyle,
		filter = this.renderContext.filter,
		miterLimit = this.renderContext.miterLimit,
	}: CanvasStrokeOptions = {}) {
		Object.assign(this.renderContext, {
			shadowColor,
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

		this.renderContext.setLineDash(lineDash);

		return this;
	}

	setTextStyle({
		align = this.renderContext.textAlign,
		baseline = this.renderContext.textBaseline,
	} = {}) {
		Object.assign(this.renderContext, {
			textAlign: align,
			textBaseline: baseline,
		});

		return this;
	}

	arc(x = 0, y = 0, radius = 1, startAngle = 0, endAngle = Math.PI * 2, counterclockwise = false) {
		this.renderContext.arc(x, y, radius, startAngle, endAngle, counterclockwise);

		return this;
	}

	arcTo(x1 = 0, y1 = 0, x2 = 0, y2 = 0, radius = 1) {
		this.renderContext.arcTo(x1, y1, x2, y2, radius);

		return this;
	}

	beginPath() {
		this.renderContext.beginPath();

		return this;
	}

	bezierCurveTo(cp1x = 0, cp1y = 0, cp2x = 0, cp2y = 0, x = 0, y = 0) {
		this.renderContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

		return this;
	}

	clip(path: Path2D, fillRule: CanvasFillRule = "nonzero") {
		switch (arguments.length) {
			case 0: this.renderContext.clip(fillRule); break;
			default: this.renderContext.clip(...arguments); // eslint-disable-line
		}

		return this;
	}

	closePath() {
		this.renderContext.closePath();

		return this;
	}

	createImageData(...data) {
		return this.renderContext.createImageData(...data);
	}

	createLinearGradient(x0 = 0, y0 = 0, x1 = 0, y1 = 0) {
		return this.renderContext.createLinearGradient(x0, y0, x1, y1);
	}

	createPattern(image, repetition) {
		return this.renderContext.createPattern(image, repetition);
	}

	createRadialGradient(x0 = 0, y0 = 0, r0 = 0, x1 = 0, y1 = 0, r1 = 0) {
		return this.renderContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
	}

	drawFocusIfNeeded(path, element) {
		this.renderContext.drawFocusIfNeeded(path, element);

		return this;
	}

	drawImage(...data) {
		this.renderContext.drawImage(...data);

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
		this.renderContext.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);

		return this;
	}

	fill(...data) {
		this.renderContext.fill(...data);

		return this;
	}

	fillText(text = "", x = 0, y = 0, mathWidth = Infinity) {
		this.renderContext.fillText(text, x, y, mathWidth);

		return this;
	}

	getContextAttributes() {
		return this.renderContext.getContextAttributes();
	}

	getImageData(sx = 0, sy = 0, sw = 1, sh = 1, settings = {}) {
		return this.renderContext.getImageData(sx, sy, sw, sh, settings);
	}

	getLineDash() {
		return this.renderContext.getLineDash();
	}

	setLineDash(segments = []) {
		this.renderContext.setLineDash(segments);

		return this;
	}

	resetLineDash() {
		this.renderContext.setLineDash([]);

		return this;
	}

	getTransform() {
		return this.renderContext.getTransform();
	}

	isPointInPath(...data) {
		return this.renderContext.isPointInPath(...data);
	}

	isPointInStroke(...data) {
		return this.renderContext.isPointInPath(...data);
	}

	lineTo(x = 0, y = 0) {
		this.renderContext.lineTo(x, y);

		return this;
	}

	measureText(text = "") {
		return this.renderContext.measureText(text);
	}

	moveTo(x = 0, y = 0) {
		this.renderContext.moveTo(x, y);

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
		this.renderContext.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);

		return this;
	}

	quadraticCurveTo(cpx = 0, cpy = 0, x = 0, y = 0) {
		this.renderContext.quadraticCurveTo(cpx, cpy, x, y);

		return this;
	}

	rect(x = 0, y = 0, width = 1, height = 1) {
		this.renderContext.rect(x, y, width, height);

		return this;
	}

	resetTransform() {
		this.renderContext.resetTransform();

		return this;
	}

	restore() {
		this.renderContext.restore();

		return this;
	}

	rotate(angle = 0) {
		this.renderContext.rotate(angle);

		return this;
	}

	save() {
		this.renderContext.save();

		return this;
	}

	scale(x = 1, y = 1) {
		this.renderContext.scale(x, y);

		return this;
	}

	scrollPathIntoView(path = null) {
		this.renderContext.scrollPathIntoView();

		return this;
	}

	setTransform(...data) {
		this.renderContext.setTransform(...data);

		return this;
	}

	stroke(path = null) {
		// eslint-disable-next-line prefer-rest-params
		this.renderContext.stroke(...[...arguments].filter(Boolean));

		return this;
	}

	strokeText(text = "", x = 0, y = 0, maxWidth = Infinity) {
		this.renderContext.strokeText(text, x, y, maxWidth);

		return this;
	}

	transform(a = 0, b = 0, c = 0, d = 0, e = 0, f = 0) {
		this.renderContext.transform(a, b, c, d, e, f);

		return this;
	}

	translate(x = 0, y = 0) {
		this.renderContext.translate(x, y);

		return this;
	}

	attach(selector: string): this;
	attach(element: HTMLElement): this;
	attach(selector: string | HTMLElement = "body") {
		if (typeof selector === "string") {
			document.querySelector(selector)?.appendChild(this.element);
		} else {
			selector.appendChild(this.element);
		}

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
