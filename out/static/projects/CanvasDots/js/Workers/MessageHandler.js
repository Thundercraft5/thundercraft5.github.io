/* eslint-disable no-promise-executor-return */
/** @typedef {(this: T, command: string, ...data: SerializableObject[]) => any} EventHandler @template T */
/** @typedef {number|string|bigint|null|undefined} SerializablePrimitive */
/** @typedef {{ [key: string]: SerializablePrimitive | SerializablePrimitive[] | SerializableObject }} SerializableObject */

/** @template {EventTarget} T */
export default class MessageHandler {
	/** @type {Map<string, EventHandler<MessageHandler>>} */
	#eventListeners = new Map();
	/** @type {Function} */
	#sendCallback = null;
	/** @type {Function} */
	#receiveCallback = null;
	/** @type {T} */
	#target = null;

	on = this.addListener;
	once = this.addSingleListener;

	constructor(
		/** @type {T} */ target,
		sendCallback = (command, ...data) => target.postMessage({ command, data }),
		receiveCallback = ({ data: { command, data } }) => ({ command, data }),
	) {
		target.addEventListener("message", this.#handleMessage.bind(this));
		target.messageHandler = this;
		this.#target = target;
		this.#sendCallback = sendCallback;
		this.#receiveCallback = receiveCallback;
	}

	/** @template {{ [key: string]: EventHandler<MessageHandler<T>> }} M */
	addListeners(/** @type {M} */ listeners = {}) {
		for (const [listener, callback] of Object.entries(listeners))
			this.addListener(listener, callback);

		return this;
	}

	addListener(command, listener) {
		if (typeof command === "object") return this.addListeners(arguments[0]);

		this.#addToRegistry(command, listener.bind(this));

		return this;
	}

	addSingleListener(command, listener) {
		const cb = (command, ...args) => {
			listener(command, ...args);

			this.removeListener(command, cb);
		};

		this.addListener(command, cb);

		return this;
	}

	removeListener(command, listener) {
		const registry = this.#fetchRegistry(command),
			i = registry.indexOf(listener);

		return i !== -1 ? (registry.splice(i, 1), false) : true;
	}

	removeAllListeners(command) {
		const listeners = this.#eventListeners.get(command);

		this.#eventListeners.delete(command);

		return listeners;
	}

	getListeners(command) {
		return this.#eventListeners.get(command);
	}

	/** @param {MessageEvent} eventArgs */
	#handleMessage(eventArgs) {
		const { command, data, type } = this.#receiveCallback(eventArgs),
			listeners = this.#fetchRegistry(command);

		if (listeners.length === 0) console.warn(`Received a command event for command "${ command }" but no listeners are registered for that event.`);

		let curListener = null;

		try {
			listeners.forEach(listener => (curListener = listener, listener(command, ...data)));
		} catch (e) {
			console.warn(`Calling the listeners for command "${ command }" result in an error:`, e);
			console.warn("Offending listener:");
			console.dir(curListener);

			this.send("error", {
				command,
				error: e,
				data,
			});
		}
	}

	/** @param {SerializableObject[]} data */
	async send(command, ...data) {
		this.#sendCallback.call(this.#target, command, ...data);

		return await this.await(command);
	}

	async await(command) {
		return await new Promise(resolve => this.once(command, (_, ...data) => resolve(data)));
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
		const reg = [];

		this.#eventListeners.set(key, reg);

		return reg;
	}

	#fetchRegistry(key) {
		return this.#hasRegistry(key) ? this.#getRegistry(key) : this.#createRegistry(key);
	}

	#createPromise() {
		let resolve, reject;
		const promise = new Promise((resolve, reject) => { resolve = resolve, reject = reject; });

		return {
			promise,
			resolve,
			reject,
		};
	}
}export { MessageHandler };