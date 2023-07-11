const User = require("../models/user");

// exports.userById = (req, res, next, id) => {
//     User.findById(id).exec((err, user) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 error: "User not found"
//             });
//         }
//         req.profile = user;
//         next();
//     });
// };

exports.userById = (req, res, next, id) => {
    User.findById(id).exec()
       .then(user => {
            if (!user) {
                return res.status(400).json({
                    error: "User not found"
                });
            }
            req.profile = user;
            next();
        })
       .catch(err => {
            return res.status(400).json({
                error: "Error retrieving user"
            });
        });
};