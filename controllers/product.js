const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");
const mongoose = require("mongoose");

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec().then((product)=>{
            if (!product) {
                return res.status(400).json({
                    error: "Product not found"
                });
            }
            req.product = product;
            next();
    }).catch((err)=>{
        if (err || !product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
    });
};

exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
          // Convert array values to strings
          for (let field in fields) {
            if (Array.isArray(fields[field])) {
                fields[field] = fields[field].join(',');
            }
        }
        console.log(fields)

        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }
        
       
        // console.log(fields);
        // return false;
        
        let product = new Product(fields);
        // console.log('check the data',product);
        if (files.photo) {
            if (files.photo[0].size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo[0].filepath);
            product.photo.contentType = files.photo[0].type;
        }
        product.save().then((result) => {
            res.json(result);
        }).catch((error) => {
            console.log(error)
            return res.staus(400).json({
                error: errorHandler(err)
            });
        });
    });
};

exports.remove = (req, res) => {
    let product = req.product;
    // if (product instanceof mongoose.Document) {
    //     console.log('h');
    //   } else {
    //     console.log('y');
    //   }
    let productId = product._id.toString();
    Product.deleteOne({ _id: productId }).then((result)=>{
        res.json({
            message: "Product deleted successfully"
        });
    }).catch((err)=>{
        return res.status(400).json({
            error: errorHandler(err)
        });
    });
    // product.remove((err, deletedProduct) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: errorHandler(err)
    //         });
    //     }
    //     res.json({
    //         message: "Product deleted successfully"
    //     });
    // });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        // Convert array values to strings
        for (let field in fields) {
            if (Array.isArray(fields[field])) {
                fields[field] = fields[field].join(',');
            }
        }
        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        ) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = req.product;
        product = _.extend(product, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size"
                });
            }
            product.photo.data = fs.readFileSync(files.photo[0].filepath);
            product.photo.contentType = files.photo[0].type;
        }

        // product.save((err, result) => {
        //     if (err) {
        //         return res.status(400).json({
        //             error: errorHandler(err)
        //         });
        //     }
        //     res.json(result);
        // });
        product.save()
            .then(result => res.json(result))
            .catch(err => res.status(400).json({ error: errorHandler(err) }));
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec().then((product)=>{
             res.json(product)
        }).catch(()=>{
            return res.status(400).json({
                error: "Products not found"
            });
        })
};

