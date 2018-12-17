"use strict";

const util = require('util');
const timeUtils = require('../../utils/time_utils');
const stringUtils = require('../../utils/string_utils');
const language = require('../../../language/language_routes');

module.exports = function (app) {
    app.locals.formattringaP = function (languageKey, key, data) {
        return util.format(language.getLanguage(key, languageKey), data);
    };

    app.locals.formattringaP2 = function (languageKey, key, data, data2) {
        return util.format(language.getLanguage(key, languageKey), data, data2);
    };

    app.locals.randomString = function () {
        return `${stringUtils.randomStringFixLengthOnlyAlphabet(5)}`;
    };

    app.locals.getCoinIcon = function (coinType) {
        switch(coinType){
            case "btc":
                return '<i class="fa fa-btc" aria-hidden="true"></i>';
                break;
            case "eth":
                return '<i class="eth-icon" aria-hidden="true"></i>';
                break;
        }
    };
};