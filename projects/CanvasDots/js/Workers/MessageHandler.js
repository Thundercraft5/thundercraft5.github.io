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
		for (const [listener, callback] of Object.entries(listeners)) this.addListener(listener, callback);

		return this;
	}

	addListener(command, listener) {
		if (typeof command === "object") return this.addListeners(arguments[0]);

		this.#addToRegistry(command, listener.bind(this));

		return this;
	}

	addSingleListener(command, listener) {
		this.addListener(command, (command, ...args) => {
			listener(command, ...args);

			this.removeListener(command, listener);
		});

		return this;
	}

	removeListener(command, listener) {
		const registry = this.#fetchRegistry(command);
		const i = registry.indexOf(listener);

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
		const { command, data, type } = this.#receiveCallback(eventArgs);
		const listeners = this.#fetchRegistry(command);

			if (listeners.length === 0) console.warn(`Received a command event for command "${ command }" but no listeners are registered for that event.`);

		listeners.forEach(listener => listener(command, ...data));
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
}

export { MessageHandler };