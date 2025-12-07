import MessageHandler from "../MessageHandler.js";

export default class TreeWorker extends Worker {
	static Message = class Message {
		command = "";
		data = [];

		constructor(command, ...data) {
			if (typeof command === "object") {
				const [{ command, data, type }] = arguments; // eslint-disable-line

				Object.assign(this, { command, data, type });
			}

			this.command = command;
			this.data = data;
		}
	};

	#eventListeners = new Map();
	/** @type {import("..").MessageHandler} */
	messageHandler = null;

	constructor(url = "./js/Workers/TreeWorker/worker.js", { name = "", type = "module" } = {}) {
		super(url, { name, type });
		this.messageHandler = new MessageHandler(this, this.#handleSend);
	}

	addListener(command, listener) {
		this.messageHandler.addListener(command, listener);

		return this;
	}

	addListeners(listeners = {}) {
		return this.messageHandler.addListeners(listeners);
	}

	removeListener(command, listener) { return this.messageHandler.removeListener(command, listener); }
	removeListeners(listeners = {}) {
		return Object.compose(listeners, (command, listener) => [command, this.removeListener(command, listener)]);
	}

	removeAllListeners(command) { return this.messageHandler.removeAllListeners(command); }
	getListeners(command) { this.messageHandler.getListeners(command); }

	addSingleListener(command, listener) {
		return this.messageHandler.addSingleListener(command, listener);
	}

	on = this.addListener;
	once = this.addSingleListener;

	/** @param {SerializableObject[]} data */
	async send(command, ...data) {
		return await this.messageHandler.send(command, ...data);
	}

	async await(command) {
		return await this.messageHandler.await(command);
	}

	#handleSend(command, ...data) {
		this.postMessage({ command, data });
	}
}