// index.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import Sidebar from "./components/sidebar";
import Chatbar from "./components/chatbar";
import Navbar from "../Navbar";

function ChatApp() {
    const { _id } = useSelector((state) => state.user); // User's ID
    const [socket, setSocket] = useState(null); // Socket state
    const [selectedConversation, setSelectedConversation] = useState(null); // Selected conversation
    const [selectedReceipient, setSelectedReceipient] = useState(null); // Selected friend to chat with
    const [selectedPicturePath, setSelectedPicturePath] = useState(null);

    // Initialize the socket and connect to the server
    useEffect(() => {
        // Use an environment variable for the socket URL
        const socketUrl = 'http://localhost:3001';

        // Initialize the socket connection
        const newSocket = io(socketUrl);

        // Handle connection errors
        newSocket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        // Set the socket instance in state
        setSocket(newSocket);

        // Cleanup function to disconnect the socket on unmount
        return () => {
            newSocket.disconnect();
            console.log('Socket disconnected');
        };
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar className="sticky top-0 z-10" />
            <div className="flex flex-1">
                {/* Sidebar with a fixed width */}
                <div className="w-64 bg-gray-100">
                    <Sidebar
                        userId={_id}
                        setSelectedConversation={setSelectedConversation}
                        setSelectedReceipient={setSelectedReceipient}
                        setSelectedPicturePath={setSelectedPicturePath}
                    />
                </div>

                {/* Chatbar takes up the remaining space */}
                <div className="flex-1 bg-white">
                    {selectedConversation ? (
                        <Chatbar
                            userId={_id}
                            conversationId={selectedConversation}
                            receipientName={selectedReceipient}
                            receipientProfile={selectedPicturePath}
                            socket={socket}
                        />
                    ) : (
                        <p className="text-center text-gray-500 mt-10">
                            Select a conversation to start chatting.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatApp;
