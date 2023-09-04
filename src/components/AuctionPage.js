import React, { useState, useEffect, useMemo } from 'react';
import WebSocketService from '../websocket/WebSocketService';
import Button from '@mui/material/Button';


export const AuctionPage = (props) => {
    const { jwt, auctionId } = props.state;
    const [auctionInfo, setAuctionInfo] = useState({});
    const [bidAmount, setBidAmount] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [imageSrc, setImageSrc] = useState('');

    const webSocketService = useMemo(() => new WebSocketService(props.state.jwt), [props.state.jwt]);

    useEffect(() => {
        fetch(`http://localhost:8080/auctions/${auctionId}`, {
            headers: {
                "Authorization": jwt
            },
        })
        .then((response) => response.json())
        .then((data) => {
            setCurrentBid(data.auctionInfo.currentBid);
            setAuctionInfo(data.auctionInfo);
        })
        .catch((error) => console.error('Error fetching auction info:', error));

        fetch(`http://localhost:8080/images/download/${auctionInfo.photoId}`, {
            headers: {
                "Authorization": jwt
            },
        })
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
    }, [auctionId, jwt, auctionInfo.photoId, webSocketService]);

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
            <Button 
                style={{ zIndex: 10, position: 'absolute', top: 20, left: 20 }} 
                variant="contained" color="secondary" 
                onClick={() => props.onRouteChange('home')}
            >
                Back
            </Button>
            <h1>{auctionInfo.title}</h1>
            <h2>{auctionInfo.description}</h2>
            <img src={imageSrc} height={300} alt="Auction Item" />

            <div>
                <p>Current Bid: {currentBid}</p>
                <input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={handleBidChange}
                />
                <Button onClick={placeBid}>Place Bid</Button>
            </div>
        </div>
    );
};
