import { KamonGame } from './game';
const API_ROOT = ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/ws";

export class KamonWebSocketService {
    room_id: string;
    host: boolean;
    socket: WebSocket
    playerJoinsCallback: () => void;
    stateUpdateCallback: (grid: KamonGame) => void;
    constructor(room_id: string, host: boolean) {
        this.room_id = room_id;
        this.host = host;
        this.socket = new WebSocket(API_ROOT);
        this.socket.onopen = (ev) => {
            this.socket.send(`* ${room_id}_${host ? 1 : 0}`);
            this.socket.send('*');
        };
        this.socket.onmessage = (ev) => {this.handleIncomingMessage(ev.data)};
    }

    sendState(grid: KamonGame) {
        this.socket.send(JSON.stringify(grid));
    }

    handleIncomingMessage(data: string): void {
        if (data[0] == "*") {
            this.playerJoinsCallback();
        } else {
            let state = JSON.parse(data);
            this.stateUpdateCallback(state);
        }
    }

    sendJoinNotification() {
       this.socket.send('*');
    }
}
