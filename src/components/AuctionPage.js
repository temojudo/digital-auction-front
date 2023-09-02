import React, { useState, useEffect } from 'react';


export const AuctionPage = (props) => {
    const auctionId = props.state.auctionId;

    const [auctionInfo, setAuctionInfo] = useState({});
    const [bidAmount, setBidAmount] = useState(0);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
    // Fetch auction information using auctionId
        fetch(`http://localhost:8080/auctions/${auctionId}`)
            .then((response) => response.json())
            .then((data) => setAuctionInfo(data.auctionInfo))
            .catch((error) => console.error('Error fetching auction info:', error));

        // Fetch image using photoId
        fetch(`http://localhost:8080/images/download/${auctionInfo.photoId}`)
            .then((response) => response.blob())
            .then((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            setImageSrc(imageUrl);
            })
            .catch((error) => console.error('Error fetching image:', error));
    }, [auctionId, auctionInfo.photoId]);

    const handleBidChange = (e) => {
        setBidAmount(e.target.value);
    };

    const placeBid = () => {
        console.log(`Placing a bid of ${bidAmount} for auction ${auctionId}`);
    };

    return (
        <div>
            <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <button onClick={() => props.onRouteChange('home')}>Back</button>
            </div>
            <h1>{auctionInfo.title}</h1>
            <p>{auctionInfo.description}</p>
            <img src={imageSrc} alt="Auction Item" />

            <div>
                <p>Current Bid: {auctionInfo.currentBid}</p>
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
