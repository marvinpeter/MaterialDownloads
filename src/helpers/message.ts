export enum Type {
	SetSeen, UpdateIcon,
}

export interface Message {
	type: Type,
	data: any,
}

type MessageCallback = (data: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void;

/**
 * Listen for messages
 * @param type message type
 * @param callback called when message is received
 */
export const on = (type: Type, callback: MessageCallback) =>
	chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
		if (message.type === type) {
			callback(message.data, sender, sendResponse);
		}
	});

/**
 * Send messages
 * @param type message type
 * @param onResponse called when response is received
 */
export const send = (type: Type, data?: any, onResponse?: (response: any) => void) =>
	chrome.runtime.sendMessage({ type, data }, onResponse);