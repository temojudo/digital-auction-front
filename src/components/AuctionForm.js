import React, { useState } from 'react';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';


export const AuctionForm = (props) => {
    const { jwt } = props.state;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDateUtc: '',
        startingBid: '',
        image: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('startDateUtc', formData.startDateUtc);
        formDataToSend.append('startingBid', formData.startingBid);
        formDataToSend.append('image', formData.image);

        try {
            const imageResponse = await fetch('http://localhost:8080/images/upload', {
                method: 'POST',
                headers: {
                    "Authorization": jwt
                },
                body: formDataToSend,
            });

            if (imageResponse.ok) {
                const { imageId } = await imageResponse.json();

                console.log("photoId", imageId)

                const auctionResponse = await fetch('http://localhost:8080/auctions/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": jwt,
                    },
                    body: JSON.stringify({
                        startingBid: formData.startingBid,
                        title: formData.title,
                        description: formData.description,
                        photoId: imageId,
                        startDateUtc: formData.startDateUtc,
                    }),
                });

                if (auctionResponse.ok) {
                    alert('Auction added successfully!');
                } else {
                    alert('Failed to add auction');
                }
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Button 
                style={{ zIndex: 10, position: 'absolute', top: 20, left: 20 }} 
                variant="contained" color="secondary" 
                onClick={() => props.onRouteChange('login')}
            >
                Logout
            </Button>
            <Button 
                style={{ zIndex: 10, position: 'absolute', top: 20, right: 20 }} 
                variant="contained" color="secondary" 
                onClick={() => props.onRouteChange('home')}
            >
                Dashboard
            </Button>
            <form onSubmit={handleSubmit}>
                <div>
                    <InputLabel>Title:</InputLabel>
                    <Input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div>
                    <InputLabel>Description:</InputLabel>
                    <Input type="text" name="description" value={formData.description} onChange={handleInputChange} required />
                </div>
                <div>
                    <InputLabel>Start Date (UTC):</InputLabel>
                    <Input type="datetime-local" name="startDateUtc" value={formData.startDateUtc} onChange={handleInputChange} required />
                </div>
                <div>
                    <InputLabel>Starting Bid:</InputLabel>
                    <Input type="number" name="startingBid" value={formData.startingBid} onChange={handleInputChange} required />
                </div>
                <div>
                    <InputLabel>Image:</InputLabel>
                    <Input type="file" accept="image/*" onChange={handleImageChange} required />
                </div>
                <div>
                    <Button type="submit">Add Auction</Button>
                </div>
            </form>
        </div>
    );
}