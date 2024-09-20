import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Avatar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

function User({ userId, picturePath }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const getUser = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [userId, token]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        width: "300px",
        height: "600px",
        backgroundColor: "white",
        borderRadius: "25px",
        py: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      {/* PROFILE PIC */}
      <Avatar
        src={picturePath}
        alt="Profile Picture"
        sx={{ width: 165, height: 165, mt: 2 }}
      />

      {/* Name */}
      <Box textAlign="center">
        <Typography variant="h4" fontWeight="600" color="textPrimary">
          {userData?.firstName + " " + userData?.lastName}
        </Typography>
      </Box>

      {/* Button */}
      <Button variant="outlined" sx={{ width: "60%", height: "50px" }}>
        Edit Profile
      </Button>

      {/* Followers */}
      <Box display="flex" gap={4} justifyContent="center">
        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            103
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Posts
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            {userData?.viewedProfile}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Viewed Profile
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="h6" fontWeight="bold">
            {userData?.impressions}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Impressions
          </Typography>
        </Box>
      </Box>

      {/* Location */}
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="600">
          {userData?.location || "Data not Available"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Location
        </Typography>
      </Box>

      {/* Occupation */}
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="600">
          {userData?.occupation || "Data not Available"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Occupation
        </Typography>
      </Box>
    </Box>
  );
}

export default User;
