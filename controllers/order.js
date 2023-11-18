const { Order, CartItem } = require("../models/order");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = async (req, res) => {
    try {
        req.body.order.user = req.profile;
        const order = new Order(req.body.order);
        const data = await order.save();
        res.json(data);
    } catch (error) {
        res.status(400).json({
            error: errorHandler(error)
        });
    }
};


exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: "Could not update product"
            });
        }
        next();
    });
};
