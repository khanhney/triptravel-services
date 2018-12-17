"use strict";

const utils = require('../../utils/utils');

module.exports = function (app) {
    app.locals.priceFormat = function (num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    };

    app.locals.baseFormatNumber = function (number, fixLength) {
        return utils.currencyFormat(number, fixLength);
    };
};