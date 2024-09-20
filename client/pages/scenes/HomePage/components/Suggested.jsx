import React, { useState } from "react";
import axios from "axios";
import { Avatar, Button, Typography, Box } from "@mui/material";

function Suggested({
  currentUserId,
  friendUserId,
  picturePath,
  firstName,
  lastName,
  location,
  token,
}) {
  const [isFriend, setIsFriend] = useState(false); // State to track if the user is a friend
  const [error, setError] = useState(null); // Error state for handling errors

  const addRemoveFriend = async () => {
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3001/users/${currentUserId}/${friendUserId}`,
        null, // No request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFriend(!isFriend); // Toggle the friend status
    } catch (error) {
      console.error("Unable to add/remove friend:", error);
      setError("An error occurred while updating the friend status.");
    }
  };

  return (
    <Box display="flex" gap={2} alignItems="center">
      {/* Profile Picture */}
      <Avatar
        alt={`${firstName} ${lastName}`}
        src={picturePath}
        sx={{ width: 55, height: 55 }}
      />

      {/* User Info and Button */}
      <Box
        flex={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {`${firstName} ${lastName}`}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {location}
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          onClick={addRemoveFriend}
          variant="outlined"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#eaeaea",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "#d0d0d0",
            },
          }}
        >
          <img
            src="assets/add-friend.png"
            alt="Add Friend"
            style={{ width: 28, height: 28 }}
          />
        </Button>
      </Box>

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default Suggested;
