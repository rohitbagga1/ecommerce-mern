const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
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
        
         // Convert array values to strings
        for (let field in fields) {
            if (Array.isArray(fields[field])) {
                fields[field] = fields[field].join(',');
            }
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
