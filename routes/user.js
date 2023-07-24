const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");


const { userById, read, update  } = require("../controllers/user");

router.get("/secret/:userId", requireSignin, isAuth, (req, res) => {
    res.json({
        user: req.profile, 
        test: req.auth
    });
});

router.param("userId", userById);
router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

module.exports = router;
