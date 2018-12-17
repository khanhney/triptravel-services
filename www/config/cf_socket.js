"use strict";

module.exports = function (session, io) {
    io.use(function (socket, next) {
        session(socket.handshake, {}, next);
    });
};