/* eslint-disable no-promise-executor-return */

type SerializablePrimitive = number | string | bigint | null | undefined;

interface SerializableObject {
	[key: string]: SerializablePrimitive | SerializablePrimitive[] | SerializableObject;
}

type EventHandler<T extends EventTarget = EventTarget> = (
	this: T,
	command: string,
	...data: SerializableObject[]
) => any;

interface MessageHandlerReceiveCallback {
	(eventArgs: MessageEvent): { command: string; data: SerializableObject[] };
}

interface MessageHandlerSendCallback {
	(command: string, ...data: SerializableObject[]): void;
}

export default class MessageHandler<T extends EventTarget = EventTarget> {
	#eventListeners: Map<string, EventHandler<T>[]> = new Map();
	#sendCallback: MessageHandlerSendCallback;
	#receiveCallback: MessageHandlerReceiveCallback;
	#target: T;

	on = this.addListener;
	once = this.addSingleListener;

	constructor(
		target: T,
		sendCallback?: MessageHandlerSendCallback,
		receiveCallback?: MessageHandlerReceiveCallback,
	) {
		target.addEventListener("message", this.#handleMessage.bind(this));
		(target as any).messageHandler = this;
		this.#target = target;
		this.#sendCallback =
			sendCallback || ((command: string, ...data: SerializableObject[]) => {
				target.postMessage({ command, data });
			});
		this.#receiveCallback =
			receiveCallback || (({ data: { command, data } }: MessageEvent) => {
				return { command, data };
			});
	}

	addListeners(listeners: Record<string, EventHandler<T>> = {}): this {
		for (const [listener, callback] of Object.entries(listeners)) {
			this.addListener(listener, callback);
		}

		return this;
	}

	addListener(command: string, listener: EventHandler<T>): this;
	addListener(listeners: Record<string, EventHandler<T>>): this;
	addListener(
		command: string | Record<string, EventHandler<T>>,
		listener?: EventHandler<T>,
	): this {
		if (typeof command === "object") {
			return this.addListeners(command);
		}

		this.#addToRegistry(command, listener!.bind(this.#target));

		return this;
	}

	addSingleListener(command: string, listener: EventHandler<T>): this {
		const parent = this;
		const cb: EventHandler<T> = function (this: T, command: string, ...args: SerializableObject[]): any {
			listener.call(this, command, ...args);
			console.log(this);
			parent.removeListener(command, cb);
		};

		this.addListener(command, cb);

		return this;
	}

	removeListener(command: string, listener: EventHandler<T>): boolean {
		const registry = this.#fetchRegistry(command);
		const i = registry.indexOf(listener);

		return i !== -1 ? (registry.splice(i, 1), false) : true;
	}

	removeAllListeners(command: string): EventHandler<T>[] | undefined {
		const listeners = this.#eventListeners.get(command);

		this.#eventListeners.delete(command);

		return listeners;
	}

	getListeners(command: string): EventHandler<T>[] | undefined {
		return this.#eventListeners.get(command);
	}

	#handleMessage(eventArgs: MessageEvent): void {
		const { command, data } = this.#receiveCallback(eventArgs);
		const listeners = this.#fetchRegistry(command);

		if (listeners.length === 0) {
			console.warn(
				`Received a command event for command "${command}" but no listeners are registered for that event.`,
			);
		}

		let curListener: EventHandler<T> | null = null;

		try {
			listeners.forEach((listener: EventHandler<T>) => {
				curListener = listener;
				listener.call(this.#target, command, ...data);
			});
		} catch (e) {
			console.warn(
				`Calling the listeners for command "${command}" result in an error:`,
				e,
			);
			console.warn("Offending listener:");
			console.dir(curListener);

			this.send("error", {
				command,
				error: e as SerializablePrimitive,
				data,
			});
		}
	}

	async send(command: string, ...data: SerializableObject[]): Promise<SerializableObject[]> {
		this.#sendCallback.call(this.#target, command, ...data);

		return await this.await(command);
	}

	async await(command: string): Promise<SerializableObject[]> {
		return await new Promise((resolve) =>
			this.once(command, (_: string, ...data: SerializableObject[]) => resolve(data)),
		);
	}

	#hasRegistry(key: string): boolean {
		return this.#eventListeners.has(key);
	}

	#getRegistry(key: string): EventHandler<T>[] {
		return this.#eventListeners.get(key)!;
	}

	#addToRegistry(key: string, listener: EventHandler<T>): EventHandler<T>[] {
		const registry = this.#fetchRegistry(key);

		registry.push(listener);

		return registry;
	}

	#createRegistry(key: string): EventHandler<T>[] {
		const reg: EventHandler<T>[] = [];

		this.#eventListeners.set(key, reg);

		return reg;
	}

	#fetchRegistry(key: string): EventHandler<T>[] {
		return this.#hasRegistry(key) ? this.#getRegistry(key) : this.#createRegistry(key);
	}
}

export { MessageHandler };