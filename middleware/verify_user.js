const jwt = require('jsonwebtoken');

module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
                if (err) {
                    return res.status(400).json({ status: false, msg: "Đã hết phiên làm việc" });

                }

                req.user = user;
                next();
            });
        } catch (err) {
            res.status(500).json({ status: false, msg: err.message });
        }
    }
}