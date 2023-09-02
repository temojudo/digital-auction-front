import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const SOCKET_URL = 'http://localhost:8080/ws';
const TOPIC_PREFIX = '/topic/auctions/';

class WebSocketService {
    constructor() {
        this.stompClient = null;
    }

    connect(auctionId, onBidChange) {
        const socket = new SockJS(SOCKET_URL);
        this.stompClient = Stomp.over(socket);

        console.log("this.stompClient", this.stompClient);

        this.stompClient.connect({}, () => {
            const topic = `${TOPIC_PREFIX}${auctionId}`;
            this.stompClient.subscribe(topic, (message) => {
                const payload = JSON.parse(message.body);
                onBidChange(payload.bidCount);
            });
        });
    }

    placeBid(auctionId, bidCount) {
        const topic = `/app/auctions/${auctionId}/placeBid`;
        this.stompClient.send(topic, {}, JSON.stringify({ bidCount }));
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
    }
}

export default WebSocketService;
