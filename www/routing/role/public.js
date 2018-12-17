"use strict";

const promise     = require('bluebird');
const roles       = require('../../config/cf_role');
const ChildRouter = require('../child_routing');

const USER_MODEL   = require('../../models/user');
const TRIP_MODEL   = require('../../models/trip');
const HOTEL_MODEL  = require('../../models/hotel');
const RATING_MODEL = require('../../models/rating');

module.exports = class Auth extends ChildRouter {
    constructor() {
        super('/');
    }

    registerRouting(io) {
        return {
            // ==================== USER ================ //
            '/register': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { username, email, password } = req.body;
                        let registerData                  = await USER_MODEL.register(username, email, password);

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
                        let signinResp                      = await USER_MODEL.signIn(username_or_email, password);

                        if (!signinResp) return res.json(signinResp);

                        res.json(signinResp);
                    }]
                },
            },
            
            '/info-user': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let user     = req.user.data_user;
                        let infoUser = await USER_MODEL.getInfoUser(user._id);

                        if (!infoUser) return res.json(infoUser);

                        res.json(infoUser);
                    }]
                },
            },
            // ==================== TRAVEL ================ //
            
            '/add-trip': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { title, description, isFeature, price, startTime } = req.body;
                        let insertTrip                                          = await TRIP_MODEL.insert(title, description, isFeature, price, startTime);
                        res.json(insertTrip);
                    }]
                },
            },

            '/info-trip/:tripID': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        const { tripID } = req.params;
                        let   infoTrip   = await TRIP_MODEL.getDetail(tripID);
                        res.json(infoTrip);
                    }]
                },
            },

            '/list-trip': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listTrip = await TRIP_MODEL.getListTrip();
                        res.json(listTrip);
                    }]
                },
            },

            // ==================== HOTEL ================ //
            '/add-hotel': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { title, description, review, price } = req.body;
                        let insertResp                            = await HOTEL_MODEL.insert(title, description, review, price);
                        res.json(insertResp);
                    }]
                },
            },

            '/detail-hotel/:hotelID': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let { hotelID } = req.params;
                        let infoHotel   = await HOTEL_MODEL.getInfo(hotelID);
                        res.json(infoHotel);
                    }]
                },
            },

            '/list-hotel': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listHotel = await HOTEL_MODEL.getListHotel();
                        res.json(listHotel);
                    }]
                },
            },

            // ==================== RATING ================ //
            '/add-rating': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let user                              = req.user.data_user;
                        let { title, comment, star, hotelID } = req.body;
                        let insertResp                        = await RATING_MODEL.insert(title, comment, star, user._id, hotelID);
                        res.json(insertResp);
                    }]
                },
            },

            '/detail-rating/:ratingID': {
                config: {
                    auth: [ roles.role.user.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let { ratingID } = req.params;
                        let infoRating   = await RATING_MODEL.getInfoRating(ratingID);
                        res.json(infoRating);
                    }]
                },
            },
        }
    }
};
