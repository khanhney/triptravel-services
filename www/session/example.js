"use strict";

const langSession = new (require('./intalize/session'))('example');
const language = require('../../language/language_routes');

module.exports = {
    save(session, lang) {
        langSession.saveSession(session, lang);
    },

    get(session) {
        return langSession.getSession(session) === null ? language.langDefault : langSession.getSession(session);
    }
};