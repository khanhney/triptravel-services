"use strict";

const mainApp = require('../../app');

module.exports = function (app) {
    app.use('/template/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/template/'));
    app.use('/views/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/views/'));
    app.use('/share-image/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/share-image/'));
    app.use('/language/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/language/'));
    app.use('/notify/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/notify/'));
    app.use('/files/', mainApp.EXPRESS.static(mainApp.BASE_DIR + '/files/'));
};