"use strict";

let cookieParser = require('cookie-parser');

exports.options = {
    maxAge: 31536000,
    httpOnly: false
};

exports.register = function (app) {
    app.use(cookieParser());
};