import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        // Correct the header name to "Authorization"
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        // Check if the token starts with "Bearer "
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft(); // Remove "Bearer " from the token
        }

        // Verify the token using the JWT secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach verified user to request object

        next(); // Proceed to the next middleware
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
