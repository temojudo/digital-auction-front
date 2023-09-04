import React, { useState, useEffect, useMemo } from 'react';
import WebSocketService from '../websocket/WebSocketService';


export const AuctionPage = (props) => {
    const auctionId = props.state.auctionId;

    const [auctionInfo, setAuctionInfo] = useState({});
    const [bidAmount, setBidAmount] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [imageSrc, setImageSrc] = useState('');

    const webSocketService = useMemo(() => new WebSocketService(props.state.jwt), [props.state.jwt]);

    useEffect(() => {
        fetch(`http://localhost:8080/auctions/${auctionId}`)
            .then((response) => response.json())
            .then((data) => {
                setCurrentBid(data.auctionInfo.currentBid);
                setAuctionInfo(data.auctionInfo);
            })
            .catch((error) => console.error('Error fetching auction info:', error));

        fetch(`http://localhost:8080/images/download/${auctionInfo.photoId}`)
            .then((response) => response.blob())
            .then((blob) => {
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
            })
            .catch((error) => console.error('Error fetching image:', error));

        webSocketService.connect(auctionId, onBidChange);

        return () => {
            webSocketService.disconnect();
        };
    }, [auctionId, auctionInfo.photoId, webSocketService]);

    const onBidChange = (newBid) => {
        setCurrentBid(newBid);
    };

    const handleBidChange = (e) => {
        setBidAmount(e.target.value);
    };

    const placeBid = () => {
        const newBidCount = parseFloat(bidAmount);
        webSocketService.placeBid(auctionId, newBidCount);
    };

    return (
        <div>
            <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <button onClick={() => props.onRouteChange('home')}>Back</button>
            </div>
            <h1>{auctionInfo.title}</h1>
            <img src={imageSrc} height={300} alt="Auction Item" />

            <div>
                <p>Current Bid: {currentBid}</p>
                <input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={handleBidChange}
                />
                <button onClick={placeBid}>Place Bid</button>
            </div>
        </div>
    );
};
