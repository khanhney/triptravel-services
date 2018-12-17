"use strict";
const jwt   = require('jsonwebtoken');
const cfJwt = require('./cf_jws');

module.exports = {
    role: {
        all: {
            bin : 1,
            auth: function (req, res, next) {
                next();
            }
        },
        user: {
            bin : 2,
            auth: function (req, res, next) {
                var token = req.params.token || req.body.token || req.query.token || req.headers[ 'x-access-token' ] || req.headers.token;
                if (token) {
                    jwt.verify(token, cfJwt.secret, function (err, decoded) {
                        if (err) {
                            return res.json({error: true, message: 'Failed to authenticate token.'});
                        } else {
                            // if (Number(decoded.role) === 1) {
                            //     req.user = decoded;
                            //     next();
                            // } else {
                            //     return res.json({success: false, message: 'Error: Permission denied.'});
                            // }
                            req.user = decoded;
                            next();
                        }
                    });
                } else {
                    return res.status(403).send({
                        success: false,
                        message: 'No token provided.'
                    });
                }
            }
        },
        admin: {
            bin : 3,
            auth: function (req, res, next) {
                var token = req.params.token ||req.body.token || req.query.token || req.headers[ 'x-access-token' ] || req.headers.token;
                if (token) {
                    jwt.verify(token, cfJwt.secret, function (err, decoded) {
                        if (err) {
                            return res.json({error: true, message: 'Failed to authenticate token.'});
                        } else {
                            if (Number(decoded.role) === 0) {
                                req.user = decoded;
                                next();
                            } else {
                                return res.json({success: false, message: 'Error: Permission denied.'});
                            }
                        }
                    });
                } else {
                    return res.status(403).send({
                        success: false,
                        message: 'No token provided.'
                    });
                }
            }
        },
    },

    authorization: function (req, res, next) {
        var hasRole     = false;
        var currentRole = null;

        for (var itemRole in this.role) {
            if (!hasRole) {
                if (res.bindingRole.config.auth.includes(this.role[ itemRole ].bin)) {
                    hasRole     = true;
                    currentRole = this.role[ itemRole ];
                }
            }
        }
        currentRole.auth(req, res, next);
    }
};