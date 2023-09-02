import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

export const HomePage = (props) => {
    const { firstname, lastname, bidCount, jwt } = props.state;

    const [data, setData] = useState({
        itemCount: 0,
        totalItemCount: 0,
        totalPageCount: 0,
        auctionDashboardViews: [],
    });

    const [pageSize, setPageSize] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageNumber(1);
    };

    const handlePageNumberChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };

    useEffect(() => {
        const apiUrl = `http://localhost:8080/auctions/dashboard?pageInfo=true&pageSize=${pageSize}&pageNumber=${pageNumber - 1}`;

        axios.get(apiUrl, {
            headers: {
                "Authorization": jwt
            }
        })
        .then((response) => {
        setData(response.data);
        })
        .catch((error) => {
        console.error('Error fetching data:', error);
        });
    }, [pageSize, pageNumber, jwt]);

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= data.totalPageCount; i++) {
            pages.push(
                <button
                    className={i === pageNumber ? 'pagination-btn-primary' : 'pagination-btn-default'}
                    key={i}
                    variant="outlined"
                    onClick={() => handlePageNumberChange(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div>
            <Button 
                style={{ position: 'absolute', top: 20, right: 20 }} 
                variant="contained" color="secondary" 
                onClick={() => props.onRouteChange('login')}
            >
                Logout
            </Button>
            <div className='dashboardPageUserInfo' >
                <h1>Dashboard</h1>
                <p>Welcome, {firstname} {lastname}</p>
                <p>Current bid count: {bidCount}</p>
            </div>
            <br />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Registration Username</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.auctionDashboardViews.map((item) => (
                            <TableRow key={item.id} onClick={() => props.onAuctionClicked(item.id)}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>{item.creationDate}</TableCell>
                                <TableCell>{item.startDate}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{item.registrationUsername}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div>
                {/* Pagination Controls */}
                {data.totalPageCount > 1 && (
                    <div>
                        <Button
                            disabled={pageNumber === 1}
                            onClick={() => handlePageNumberChange(pageNumber - 1)}
                        >
                            Previous
                        </Button>
                        {renderPageNumbers()}
                        <Button
                            disabled={pageNumber === data.totalPageCount}
                            onClick={() => handlePageNumberChange(pageNumber + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
            <br />
            <div>
                <FormControl>
                    <InputLabel>Page Size</InputLabel>
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}
