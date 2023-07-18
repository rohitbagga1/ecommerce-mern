const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { 
    create,
    categoryById,
    read,
    update,
    remove,
    list 
} = require("../controllers/category");
const { userById } = require("../controllers/user");


router.get("/category/:categoryId", read);
router.put(
    "/category/:categoryId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/category/:categoryId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/categories", list);
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);

module.exports = router;
router.param("userId", userById);
router.param("categoryId", categoryById);