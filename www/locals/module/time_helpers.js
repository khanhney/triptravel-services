"use strict";

const timeUtils = require('../../utils/time_utils');

module.exports = function (app) {
    app.locals.convertDateShow1 = function (date) {
        return timeUtils.parseTimeFormat4(date);
    };

    app.locals.convertDateShow2 = function (date) {
        return timeUtils.parseTimeFormat5(date);
    };
};