"use strict";

const userSession = new (require('./intalize/session'))('User');

module.exports = {
    saveTokenUser(session, token) {
        userSession.saveSession(session, token);
    },

    getTokenUser(session) {
        return userSession.getSession(session);
    }
};