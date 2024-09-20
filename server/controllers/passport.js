import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'; // Correct import
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Configure Passport to use Google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);

        // Check if user already exists in our DB
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        // If not, create a new user
        const newUser = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            picturePath: profile._json.picture,
            // Add any other fields you want to save
        });
        await newUser.save();

        done(null, newUser);
    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        done(error, null);
    }
}));

// Serialize user to store user ID in the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user to retrieve user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error, null);
    }
});
