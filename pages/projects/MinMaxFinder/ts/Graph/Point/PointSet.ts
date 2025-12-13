import Point from "./Point";

export default class PointSet extends Set<Point> {
	#cache: Record<string, Point> = {};

	constructor(...items: Point[]) {
		super();
		items.forEach(point => this.add(point));
	}

	add(point: Point): this {
		super.add(point);
		this.#cache[[point.x, point.y].toString()] = point;
		return this;
	}

	addAll(...points: Point[]): this {
		points.forEach(point => this.add(point));
		return this;
	}

	get(x: number = 0, y: number = 0): Point | undefined {
		return this.#cache[[x, y].toString()];
	}

	has(point: Point | number, y: number = 0): boolean {
		return typeof point === "number"
			? !!this.#cache[[point, y].toString()]
			: !!this.#cache[[point.x, point.y].toString()];
	}

	delete(point: Point | number, y: number = 0): boolean {
		const key = typeof point === "number" ? [point, y].toString() : [point.x, point.y].toString();
		const had = !!this.#cache[key];
		if (had) delete this.#cache[key];
		return had;
	}
}
