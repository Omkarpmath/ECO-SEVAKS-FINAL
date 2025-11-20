const { findUserById } = require('../collections/users');

// Session-based authentication middleware
const protect = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authorized, please login' });
    }

    try {
        const user = await findUserById(req.session.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Not authorized' });
    }
};

// Authorization middleware for specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Not authorized to access this route'
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
