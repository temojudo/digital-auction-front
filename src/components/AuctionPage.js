import React, { useState, useEffect, useMemo } from 'react';
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import WebSocketService from '../websocket/WebSocketService';
import Button from '@mui/material/Button';


export const AuctionPage = (props) => {
    const { auctionId } = useParams()
    const { jwt, username } = props.state;
    const [auctionInfo, setAuctionInfo] = useState({});
    const [bidAmount, setBidAmount] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [imageSrc, setImageSrc] = useState('');
    const [winnerMessageColor, setWinnerMessageColor] = useState('');
    const [timeLeft, setTimeLeft] = useState(null);

    const navigate = useNavigate();

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

            if (data.auctionInfo.buyerUsername === username) {
                setWinnerMessageColor('green');
            } else if (data.auctionInfo.buyerUsername !== null) {
                setWinnerMessageColor('red');
            }
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

        webSocketService.connect(auctionId, onBidChange, onAuctionFinished);

        const updateRemainingTime = () => {
            if (auctionInfo.status === 'CREATED') {
                const startDate = new Date(auctionInfo.startDate);
                const now = new Date();
                const timeDifference = startDate - now;

                if (timeDifference > 0) {
                    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                    const timeLeftString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                    setTimeLeft(timeLeftString);
                } else {
                    clearInterval(intervalId); // Stop updating when the auction ends
                    setTimeLeft('Auction has ended');
                }
            }
        };

        updateRemainingTime();
        const intervalId = setInterval(updateRemainingTime, 1000);

        return () => {
            webSocketService.disconnect();
            clearInterval(intervalId);
        };
    }, [auctionId, jwt, username, auctionInfo.status, auctionInfo.startDate, auctionInfo.photoId, webSocketService]);

    const onBidChange = (newBid) => {
        setCurrentBid(newBid);
    };

    const onAuctionFinished = () => {
        alert('Auction finished, refresh to see winner');
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
                onClick={() => navigate('/home')}
            >
                Back
            </Button>
            <h1>{auctionInfo.title}</h1>
            <h2>{auctionInfo.description}</h2>
            <h3>start date - {auctionInfo.startDate}</h3>
            {auctionInfo.status === 'CREATED' && (
                <div>
                    <p>Time Left: {timeLeft}</p>
                </div>
            )}
            <img src={imageSrc} height={300} alt="Auction Item" />

            <div>
                {auctionInfo.buyerUsername === null ? (
                    <p>No winner yet</p>
                ) : (
                    <p style={{ color: winnerMessageColor }}>
                        Winner is {auctionInfo.buyerUsername}
                    </p>
                )}
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
