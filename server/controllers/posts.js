import Post from "../models/Post.js";
import User from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE
export const createPost = async (req, res) => {
    try {
        const { userId, description } = req.body;

        const localFilePath = req.file ? req.file.path : null;

        // Upload the image to Cloudinary
        let pictureUrl = null;
        if (localFilePath) {
            const response = await uploadOnCloudinary(localFilePath);
            if (response) {
                pictureUrl = response.url; 
            }
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new post
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: pictureUrl,
            likes: {},
            comments: []
        });

        await newPost.save();

        // Return the newly created post
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

//READ
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });;
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//UPDATE
export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = await post.likes(userId);

        if(isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, {likes: post.likes}, {new: true}
        );

        res.status(200).json(updatedPost);
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}