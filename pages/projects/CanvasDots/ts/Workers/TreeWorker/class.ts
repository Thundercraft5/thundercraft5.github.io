import { WorkerError } from "../../../../../../src/util/errors.ts";
import MessageHandler from "../MessageHandler.ts";

console.log("TreeWorker loaded");

/**
 * Get the URL for the worker script based on the current environment
 */
function getWorkerUrl(): string {
	// In browser environment, construct URL dynamically
	if (typeof window !== 'undefined') {
		// For development: use relative path to the worker file
		if (process.env.NODE_ENV === 'development') {
			const workerUrl = new URL('./TreeWorker.worker.ts', import.meta.url);
			return workerUrl.href;
		}
	}

	throw new WorkerError("INVALID_ENV");
}

export default class TreeWorker extends EventTarget {
	private worker: Worker;
	static Message = class Message {
		command = "";
		data = [];

		constructor(commandObj, ...data) {
			if (typeof commandObj === "object") {
				const [{ command, data, type }] = commandObj; // eslint-disable-line

				Object.assign(this, { command, data, type });
			}

			this.command = command;
			this.data = data;
		}
	};

	#eventListeners = new Map();
	/** @type {import("..").MessageHandler} */
	
	messageHandler = null;

	constructor(worker: Worker) {
		super();

		// create underlying Worker instance instead of extending Worker
		this.worker = worker;
		this.messageHandler = new MessageHandler(this.worker, this.#handleSend.bind(this));
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
		this.worker.postMessage({ command, data });
	}
}