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

// exports.categoryById = (req, res, next, id) => {
//   Category.findById(id).exec((err, category) => {
//       if (err || !category) {
//           return res.status(400).json({
//               error: "Category does not exist"
//           });
//       }
//       req.category = category;
//       next();
//   });
// };

exports.categoryById = (req, res, next, id) => {
  Category.findById(id)
   .then((category) => {
      if (!category) {
        return res.status(400).json({
          error: "Category does not exist",
        });
      }
      req.category = category;
      next();
    })
   .catch((err) => {
      return res.status(400).json({
        error: "Error occurred while retrieving category",
      });
    });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  // category.save((err, data) => {
  //     if (err) {
  //         return res.status(400).json({
  //             error: errorHandler(err)
  //         });
  //     }
  //     res.json(data);
  // });
  category.save()
 .then((data) => res.json(data))
 .catch((err) => {
  console.log(err)
    return res.status(400).json({
      error: errorHandler(err),
    });
  });
};

// exports.remove = (req, res) => {
//   const category = req.category;
//   category.remove((err, data) => {
//       if (err) {
//           return res.status(400).json({
//               error: errorHandler(err)
//           });
//       }
//       res.json({
//           message: "Category deleted"
//       });
//   });
// };

exports.remove = (req, res) => {
  const category = req.category;

  let categoryid = category._id.toString();
  category.deleteOne({ _id: categoryid })
  .then((data) => {
      res.json({
        message: "Category deleted",
      });
    })
  .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};

// exports.list = (req, res) => {
//   Category.find().exec((err, data) => {
//       if (err) {
//           return res.status(400).json({
//               error: errorHandler(err)
//           });
//       }
//       res.json(data);
//   });
// };

exports.list = (req, res) => {
  Category.find()
   .then((data) => res.json(data))
   .catch((err) => {
      return res.status(400).json({
        error: errorHandler(err),
      });
    });
};