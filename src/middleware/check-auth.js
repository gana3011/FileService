import jwt from 'jsonwebtoken';

export const CheckAuth = (req, res, next) => {
    const authHeader = String(req.headers['authorization'] || '');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded; 
        next();
    } catch (err) {
        console.error('JWT verification error:', err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}