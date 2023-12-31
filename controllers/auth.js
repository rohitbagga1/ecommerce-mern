const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check

exports.signup = async (req, res) => {
    console.log("req.body", req.body);
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.json({
            user: savedUser
        });
    } catch (error) {
        let msg =  errorHandler(error)
        console.log('kfkjhdkhsf');
        console.log(error);
        res.status(400).json({
            msg
        });
    }
};

// exports.signin = (req, res) => {
//     // find the user based on email
//     const { email, password } = req.body;
//     User.findOne({ email }, (err, user) => {
//         if (err || !user) {
//             return res.status(400).json({
//                 error: "User with that email does not exist. Please signup"
//             });
//         }
//         // if user is found make sure the email and password match
//         // create authenticate method in user model
//         if (!user.authenticate(password)) {
//             return res.status(401).json({
//                 error: "Email and password dont match"
//             });
//         }
//         // generate a signed token with user id and secret
//         const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//         // persist the token as 't' in cookie with expiry date
//         res.cookie("t", token, { expire: new Date() + 9999 });
//         // return response with user and token to frontend client
//         const { _id, name, email, role } = user;
//         return res.json({ token, user: { _id, email, name, role } });
//     });
// };

exports.signin = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password dont match"
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("t", token, { expire: new Date() + 9999 });
        const { _id, name, role } = user;
        email = user.email
        return res.json({ token, user: { _id, email, name, role } });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access denied",
            a:req.auth,
            b:req.profile,
            c:req.auth._id
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};
