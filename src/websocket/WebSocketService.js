import SockJS from 'sockjs-client';
import Stomp from 'stompjs';


const SOCKET_URL = 'http://localhost:8080/ws';
const TOPIC_PREFIX = '/topic/auctions/';

class WebSocketService {
    constructor(jwt) {
        this.stompClient = null;
        this.jwt = jwt;
    }

    connect(auctionId, onBidChange, onAuctionFinished) {
        const socket = new SockJS(SOCKET_URL);
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, () => {
            const topic = `${TOPIC_PREFIX}${auctionId}`;
            if (this.stompClient.connected) {
                this.stompClient.subscribe(topic, (message) => {
                    const payload = JSON.parse(message.body);
                    onBidChange(payload.bidValue);
                });

                this.stompClient.subscribe(`${topic}/finished`, () => {
                    onAuctionFinished();
                });
            }
        });
    }

    placeBid(auctionId, bidCount) {
        const topic = `/app/auctions/${auctionId}/placeBid`;
        this.stompClient.send(topic, {}, JSON.stringify({ bidValue: bidCount, userJwt: this.jwt }));
    }

    disconnect() {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.disconnect();
        }
    }
}

export default WebSocketService;
