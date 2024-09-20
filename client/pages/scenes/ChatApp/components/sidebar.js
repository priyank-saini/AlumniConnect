// sidebar.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, Modal, Box, List, ListItem, ListItemText, Divider, Checkbox } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Sidebar({ userId, setSelectedConversation, setSelectedReceipient, setSelectedPicturePath }) {
    const [conversations, setConversations] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const token = useSelector((state) => state.token); // JWT Token from Redux

    useEffect(() => {
        getConversations();
        getFriends();
    }, []);

    const getConversations = async () => {
        try {
            const response = await axios.get('http://localhost:3001/chat/conversations', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setConversations(response.data);
        } catch (error) {
            console.log("Error fetching conversations: ", error);
        }
    };

    const getFriends = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/users/${userId}/friends`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setFriends(response.data);
        } catch (error) {
            console.log("Error fetching friends: ", error);
        }
    };

    const createConversation = async () => {
        try {
            const response = await axios.post('http://localhost:3001/chat/conversations', {
                participants: [userId, ...selectedFriends],
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setModalOpen(false);
            getConversations();
        } catch (error) {
            console.log("Error creating conversation: ", error);
        }
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSelectFriend = (friendId) => {
        setSelectedFriends(prev =>
            prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]
        );
    };

    return (
        <div className='max-w-[300px] flex flex-col h-full items-start bg-[#fff] px-10 py-5'>
            <Button
                variant='contained'
                onClick={handleOpenModal}
                sx={{
                    backgroundColor: 'black',
                    paddingX: "20px",
                    paddingY: "12px",
                    borderRadius: "15px",
                    color: 'white',
                    '&:hover': { backgroundColor: '#333' }
                }}
                startIcon={<CreateIcon style={{ color: 'white' }} />}
            >
                <Typography variant='h5' sx={{ color: 'white', textTransform: 'none' }}>
                    New Message
                </Typography>
            </Button>

            <div className='pt-10 flex flex-col gap-5'>
                <Typography variant='h5' sx={{ color: "grey" }}>
                    Direct Messages
                </Typography>
                {conversations.map(convo => (
                    <Button
                        key={convo._id}
                        sx={{
                            color: "black",
                            '&:hover': { backgroundColor: '#f0f0f0' },
                            paddingX: "15px",
                            paddingY: "10px",
                            textTransform: 'none',
                        }}
                        onClick={() => {
                            setSelectedConversation(convo._id);
                            setSelectedReceipient(convo.receipientName);
                            setSelectedPicturePath(convo.receipientPicturePath)
                        }}
                        className='flex flex-row gap-2 w-full'
                    >
                        <img src={convo.receipientPicturePath} className='w-[50px] h-[50px] object-cover rounded-full' alt='Profile'></img>
                        <p className='font-semibold text-black text-[16px]'>
                            {convo.receipientName}
                        </p>
                    </Button>
                ))}
            </div>

            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={{ ...style, width: 400 }}>
                    <Typography variant='h6'>Create New Conversation</Typography>
                    <List>
                        {friends.map(friend => (
                            <ListItem key={friend._id} onClick={() => handleSelectFriend(friend._id)}>
                                <ListItemText primary={friend.firstName + ' ' + friend.lastName} />
                                <Checkbox checked={selectedFriends.includes(friend._id)} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <Button variant='contained' onClick={createConversation} sx={{ mt: 2 }}>
                        Create Conversation
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default Sidebar;
