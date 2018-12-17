"use strict";

let viewConf = require('./cf_view');
let folderConf = require('./cf_folder');
let sessionConf = require('./cf_session');
let requestConf = require('./cf_request');
let socketConf = require('./cf_socket');
let cookieConf = require('./cf_cookie');

module.exports = function (app, io) {
    cookieConf.register(app);
    let session = sessionConf.sessionConf(app);
    socketConf(session, io);
    viewConf(app);
    folderConf(app);
    requestConf(app);
};