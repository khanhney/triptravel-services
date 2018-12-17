"use strict";

const promise = require('bluebird');
const roles = require('../../config/cf_role');
const ChildRouter = require('../child_routing');

module.exports = class Auth extends ChildRouter {
    constructor() {
        super('/');
    }

    registerRouting(io) {
        return {
            '/': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ function (req, res) {
                        res.json({ error: false, message: 'response_success' });
                    }]
                },
            },
            '/test': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    inc : 'inc/home/index.ejs',
                    view: 'index.ejs'
                },
                methods: {
                    get: [ function (req, res) {
                        ChildRouter.renderToView(req, res);
                    }]
                },
            },
        }
    }
};
