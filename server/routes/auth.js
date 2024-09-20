import express from "express";
import { login } from "../controllers/auth.js";
import passport from "passport";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
dotenv.config();

const router = express.Router();

router.post("/login", login);

router.get("/google", passport.authenticate('google', {
    scope: ['profile', 'email']
}));


router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
    async (req, res) => {
        const user = req.user;

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Encode the user data to pass as a URL parameter
        const encodedUser = encodeURIComponent(JSON.stringify({
            firstName: user.firstName,
            email: user.email,
            _id: user._id,
            picturePath: user.picturePath,
            lastName: user.lastName
        }));

        console.log("User Data: ", user);

        // Redirect to frontend with token and user data in URL params
        res.redirect(`http://localhost:3000/home?token=${token}&user=${encodedUser}`);
    }
);



export default router;

