import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// REGISTER USER
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation
        } = req.body;
        
        const localFilePath = req.file ? req.file.path : null;
        let pictureUrl = null;

        if (localFilePath) {
            const response = await uploadOnCloudinary(localFilePath);
            if (response) {
                pictureUrl = response.url; 
            }
        }

        // Create new user with or without picture
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: pictureUrl || '', 
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

// LOGGING IN
export const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email: email});
        if(!user){
            console.log("User does not exist.");
            return res.status(400).json({ msg: "User does not exist." });
        } 

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
        {
            console.log("Invalid password or username");
            return res.status(400).json({ msg: "Invalid password or username" });
        } 

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password;

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set true for HTTPS (you can customize this based on your environment)
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        console.log(user);

        res.status(200).json({token, user});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

