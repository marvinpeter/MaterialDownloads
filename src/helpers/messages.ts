export enum MessageType {
    UpdateIcon, SetSeen
}

export interface Message {
    type: MessageType,
    data: any
}

type MessageCallback = (data: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void

/**
 * Listen for messages
 * @param type message type
 * @param callback called when message is received
 */
export function onMessageReceived(type: MessageType, callback: MessageCallback) {
	console.log(type)
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
		console.log(message)
		if (message.type === type) {
			callback(message.data, sender, sendResponse)
		}
	})
}

/**
 * Send messages
 * @param type message type
 * @param onResponse called when response is received
 */
export function sendMessage(type: MessageType, data?: any, onResponse?: (response: any) => void ) {
	chrome.runtime.sendMessage({ type, data }, onResponse)
}