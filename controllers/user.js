const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");

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
