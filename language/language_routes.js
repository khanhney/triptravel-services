"use strict";

let langModule = require('./language');

let defaultLanguage = 'vn';
exports.defaultLanguage = defaultLanguage;

exports.getListLanguages = [
    {name: 'Việt Nam', key: 'vn', alpha2Code: 'VN'},
    {name: 'English', key: 'en', alpha2Code: 'GB'},
];

exports.getLanguageLocal = function (app) {
    app.locals.getLanguage = function (key, lang) {
        if(langModule[key] && langModule[key][lang]){
            return langModule[key][lang];
        }else{
            return key;
        }
    }
};


exports.getLanguage = function (key, lang) {
    if(langModule[key] && langModule[key][lang]){
        return langModule[key][lang];
    }else{
        return key;
    }
};


exports.checkLanguageKey = function (key) {
    let match = false;
    let langGol;
    this.getListLanguages.forEach(function (lang, index) {
        if (key === lang.key) {
            match = true;
            langGol = lang;
        }
    });
    if (match) {
        return langGol;
    } else {
        this.getListLanguages.forEach(function (lang, index) {
            if (key === defaultLanguage) {
                langGol = lang;
            }
        });
        return langGol;
    }
};