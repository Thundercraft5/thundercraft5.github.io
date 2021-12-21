export default class TreeWorker extends Worker {
	#eventListeners = new Map();

	constructor(url = window.location.href, options = {}) {
		super(url, options);

		super.addEventListener("message", this.#handleMessage);
	}

	addEventListener(type, listener) {
		this.#addToRegistry(type, listener);

		return this;
	}

	removeEventListener(type, listener) {
		const registry = this.#fetchRegistry(type);
		const i = registry.findIndex(v => v === listener);

		if (i !== -1) return registry.splice(i, 1), false;
		else return true;
	}

	#handleMessage(event) {

	}

	dispatch(event, ...args) {
		this.#fetchRegistry(event).forEach(listener => listener({
			type: event,
			data: args,
		}));

		return this;
	}

	#hasRegistry(key) {
		return this.#eventListeners.has(key);
	}

	#getRegistry(key) {
		return this.#eventListeners.get(key);
	}

	#addToRegistry(key, listener) {
		const registry = this.#fetchRegistry(key);

		registry.push(listener);

		return registry;
	}

	#createRegistry(key) {
		this.#eventListeners.set(key, []);

		return this;
	}

	#fetchRegistry(key) {
		let registry;

		if (this.#hasRegistry(key))
			registry = this.#getRegistry(key);

		else this.#createRegistry(key);

		return registry;
	}
}