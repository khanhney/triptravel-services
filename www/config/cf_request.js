"use strict";

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

module.exports = function (app) {
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(fileUpload());
};