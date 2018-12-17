"use strict";

const timeHelper = require('./module/time_helpers');
const numberHelper = require('./module/number_helpers');
const string = require('./module/string');
const languageRoutes = require('../../language/language_routes');

module.exports = function (app) {
    timeHelper(app);
    numberHelper(app);
    string(app);
    languageRoutes.getLanguageLocal(app);
};