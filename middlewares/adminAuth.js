import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "User not authorized", success: false });
        }

        const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!tokenVerified) {
            return res.status(401).json({ message: "Invalid token", success: false });
        }

        if (tokenVerified.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only.", success: false });
        }

        req.user = tokenVerified; // Add token payload to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || "Authorization failed", success: false });
    }
};
