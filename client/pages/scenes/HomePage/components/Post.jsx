import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";

function Post({
  userId,
  postId,
  profile,
  username,
  location,
  attachment,
  likes,
  comments: initialComments,
  desc,
}) {
  const token = useSelector((state) => state.token);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState(initialComments || []);

  // Like state management
  useEffect(() => {
    const totalLikes = Object.keys(likes).length;
    setLikeCount(totalLikes);
    setIsLiked(!!likes[userId]);
  }, [likes, userId]);

  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${postId}/like`,
        { userId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedPost = response.data;
      setLikeCount(Object.keys(updatedPost.likes).length);
      setIsLiked(!!updatedPost.likes[userId]);
    } catch (error) {
      console.error("Error liking post:", error.response || error.message);
    }
  };

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.patch(
          `http://localhost:3001/posts/${postId}/comment`,
          { userId: userId, text: newComment },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const updatedPost = response.data;
        setComments(updatedPost.comments);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "white",
        borderRadius: "25px",
        padding: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* PROFILE */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={profile}
          alt={`${username}'s profile`}
          sx={{ width: 60, height: 60 }}
        />
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {username}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {location}
          </Typography>
        </Box>
      </Box>

      {/* ATTACHMENT */}
      {attachment && (
        <Box>
          <img
            src={attachment}
            alt="Post content"
            style={{
              width: "100%",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
        </Box>
      )}

      {/* DESCRIPTION */}
      <Typography variant="body1" color="textPrimary">
        {desc}
      </Typography>

      {/* LIKE AND COMMENTS */}
      <Box display="flex" gap={3} alignItems="center">
        {/* LIKE BUTTON */}
        <IconButton onClick={handleLike}>
          {isLiked ? (
            <ThumbUpIcon
              color="primary"
              sx={{ width: "1.5rem", height: "1.5rem" }}
            />
          ) : (
            <ThumbUpOffAltIcon sx={{ width: "1.5rem", height: "1.5rem" }} />
          )}
        </IconButton>
        <Typography variant="body2">
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </Typography>

        {/* COMMENTS BUTTON */}
        <IconButton onClick={handleToggleComments}>
          <CommentIcon sx={{ width: "1.5rem", height: "1.5rem" }} />
        </IconButton>
        <Typography
          variant="body2"
          sx={{ cursor: "pointer" }}
          onClick={handleToggleComments}
        >
          {comments.length} Comments
        </Typography>
      </Box>

      {/* COMMENTS SECTION */}
      {showComments && (
        <Box sx={{ mt: 2, backgroundColor: "#f5f5f5", borderRadius: 2, p: 2 }}>
          {comments.map((comment) => (
            <Box
              key={comment.userId}
              sx={{ borderBottom: "1px solid #e0e0e0", mb: 1 }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.firstName}
              </Typography>
              <Typography variant="body2">{comment.text}</Typography>
            </Box>
          ))}

          {/* ADD NEW COMMENT */}
          <Box display="flex" gap={2} mt={2}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
            >
              Add
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Post;
