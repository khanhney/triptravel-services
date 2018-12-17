"use strict";

const mainApp = require('../../app');

module.exports = function (app) {
    app.set('view engine', 'ejs');
    app.set('views', `${mainApp.BASE_DIR}/www/views/`);
    app.set('view cache', true);
};