import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

function CreatePost({ userId, picturePath }) {
  const _id = userId;
  const token = useSelector((state) => state.token);
  const [desc, setDesc] = useState("");
  const [picture, setPicture] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !_id) {
      setError("No authentication token or user ID found.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", desc);
    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle successful response
      setSuccessMessage("Post created successfully!");
      setDesc("");
      setPicture(null);
      router.push("/home");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the post."
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      method="post"
      encType="multipart/form-data"
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "25px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        paddingX: 3,
        paddingY: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Profile */}
        <Avatar
          alt="Profile"
          src={picturePath}
          sx={{ width: 60, height: 60 }}
        />

        {/* What's Happening */}
        <TextField
          variant="outlined"
          fullWidth
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What's on your mind?"
          sx={{ marginLeft: 2, backgroundColor: "#eeeeee", borderRadius: 1 }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Upload Section */}
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
        >
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={(e) => setPicture(e.target.files[0])}
          />
          <PhotoCamera />
          <Typography variant="body1" component="span" sx={{ marginLeft: 1 }}>
            Photos
          </Typography>
        </IconButton>

        {/* Submit Button */}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ borderRadius: "25px", paddingX: 4, paddingY: 1 }}
        >
          Post
        </Button>
      </Box>

      {/* Error and Success Messages */}
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success.main" variant="body2">
          {successMessage}
        </Typography>
      )}
    </Box>
  );
}

export default CreatePost;
