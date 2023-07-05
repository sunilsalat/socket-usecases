ws doesnt support autoconnection , lonpolling, multiplexing, multiroom

const socket = io('wss://mc-api-dev.proactunited.com', {
transports: ['websocket'],
reconnectionDelayMax: 10000,
withCredentials: true,
});
