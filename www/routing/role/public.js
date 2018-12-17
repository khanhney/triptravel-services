"use strict";

const promise = require('bluebird');
const roles = require('../../config/cf_role');
const ChildRouter = require('../child_routing');

const USER_MODEL  = require('../../models/user');

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
            

            '/register': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { username, email, password } = req.body;
                        let registerData = await USER_MODEL.register(username, email, password);

                        if (!registerData) return res.json(registerData);

                        res.json(registerData);
                    }]
                },
            },

            '/sign-in': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { username_or_email, password } = req.body;
                        let signinResp = await USER_MODEL.signIn(username_or_email, password);

                        if (!signinResp) return res.json(signinResp);

                        res.json(signinResp);
                    }]
                },
            },

            '/info-user/:userId': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { userId } = req.params;
                        let infoUser = await USER_MODEL.getInfoUser(userId);

                        if (!infoUser) return res.json(infoUser);

                        res.json(infoUser);
                    }]
                },
            },
        }
    }
};
