const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = async (req, res) => {
    const category = new Category(req.body);
    // category.save((err, data) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: errorHandler(err)
    //         });
    //     }
    //     res.json({ data });
    // });
    try {
        const data = await category.save();
        res.json({ data });
      } catch (err) {
        res.status(400).json({ error: errorHandler(err) });
      }
};
