"use strict";

const promise     = require('bluebird');
const roles       = require('../../config/cf_role');
const ChildRouter = require('../child_routing');

const USER_MODEL     = require('../../models/user');
const TRIP_MODEL     = require('../../models/trip');
const HOTEL_MODEL    = require('../../models/hotel');
const RATING_MODEL   = require('../../models/rating');
const TRIP_COLL      = require('../../database/travel-coll');
const APP            = require('../../../app');
const stringUtils    = require('../../utils/string_utils');
const HOTEL_COLL     = require('../../database/hotel-coll');
const CHATBOT_COLL   = require('../../database/chatbot-coll');
const { chatBotKit } = require('../../utils/chatbot_kit');

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
                    get: [ async (req, res) => {
                        ChildRouter.redirect(res, '/list-travel');
                    }]
                },
            },
            
            '/list-travel': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/list-travel.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        try {
                            let listTravel = await TRIP_COLL.find({});
                            if (!listTravel) return res.json({ error: true, message: 'cannot_get_list' });
                            ChildRouter.renderToView(req, res, { listTravel });
                        } catch (error) {
                            return res.json({ error: true, message: error.message });
                        }
                    }]
                },
            },
            '/list-hotel-travel': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/list-hotel.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listHotel = await HOTEL_MODEL.getListHotel();
                        ChildRouter.renderToView(req, res, { listHotel: listHotel.data });
                    }]
                },
            },
            '/list-rating-user': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/list-rating-user.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listHotel = await RATING_MODEL.getListRatingWithHotel();
                        ChildRouter.renderToView(req, res, { listHotel: listHotel.data });
                    }]
                },
            },
            '/list-chatbot': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/list-chatbot.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listChat = await CHATBOT_COLL.find({});
                        ChildRouter.renderToView(req, res, { listChat: listChat });
                    }]
                },
            },
            '/init-travel': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/init-travel.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        ChildRouter.renderToView(req, res, { infoTrip: undefined });
                    }]
                },
            },

            '/init-hotel-travel': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/init-hotel-travel.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        ChildRouter.renderToView(req, res, { infoHotel: undefined });
                    }]
                },
            },


            '/info-trip/:tripID': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/init-travel.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        const { tripID } = req.params;
                        let   infoTrip   = await TRIP_MODEL.getDetail(tripID);
                        return ChildRouter.renderToView(req, res, { infoTrip: infoTrip.data });
                    }]
                },
            },

            '/info-hotel/:hotelID': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'view',
                    view: 'index.ejs',
                    inc : 'inc/dashboard/init-hotel-travel.ejs',
                },
                methods: {
                    get: [ async (req, res) => {
                        const { hotelID } = req.params;
                        let   infoHotel   = await HOTEL_MODEL.getInfo(hotelID);
                        return ChildRouter.renderToView(req, res, { infoHotel: infoHotel.data });
                    }]
                },
            },

            // ==================== API ================ //
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
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { title, description, isFeature, price, startTime, status } = req.body;
                        let insertTrip                                                  = await TRIP_MODEL.insert(title, description, isFeature, price, startTime, status);
                        res.json(insertTrip);
                    }]
                },
            },

            '/api/info-trip/:tripID': {
                config: {
                    auth: [ roles.role.all.bin ],
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
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listTrip = await TRIP_MODEL.getListTrip();
                        res.json(listTrip);
                    }]
                },
            },

            '/remove-trip/:tripID': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let { tripID } = req.params;
                        let removeTrip = await TRIP_MODEL.removeTrip(tripID);
                        res.json(removeTrip);
                    }]
                },
            },

            '/update-trip/:tripID': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { tripID }                                                  = req.params;
                        let { title, description, isFeature, price, startTime, status } = req.body;
                        let updateTrip                                                  = await TRIP_MODEL.update(tripID, title, description, isFeature, price, startTime, status);
                        res.json(updateTrip);
                    }]
                },
            },

            '/upload-image-trip/:tripID': {
                config: {
                    auth: [roles.role.all.bin],
                    type: 'json',
                },
                methods: {
                    post: [async (req, res) => {
                        const { tripID } = req.params;
                        if (req.files) {
                            const uploadPath = `${APP.BASE_DIR}/files/trip`;

                            // FOR WINDOWS
                            // fileUtils.checkAndCreateFolder(uploadPath);
            
                            let file = req.files.image;
            
                            const filePath    = file.name.split('.');
                            const newFileName = `${stringUtils.md5((new Date()).getTime() + '_' + stringUtils.md5(file.name) + '_' + stringUtils.randomString())}.${filePath[ filePath.length - 1 ]}`;
            
                            file.mv(`${uploadPath}/${newFileName}`, function (err) {
                                if (err) return res.json({
                                    error  : true,
                                    message: 'cannot_update_image'
                                })
                            });
            
                            let uploadImage = await TRIP_COLL.findByIdAndUpdate(tripID, {
                                image: `/files/trip/${newFileName}`
                            }, { new: true });
                            
                            if (!uploadImage) return res.json({ error: true, message: 'cannot_upload_image' });

                            res.json({ error: false, data: uploadImage });
                        }                        
                    }]
                },
            },

            // ==================== HOTEL ================ //
            '/add-hotel': {
                config: {
                    auth: [ roles.role.all.bin ],
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

            '/upload-image-hotel/:hotelID': {
                config: {
                    auth: [roles.role.all.bin],
                    type: 'json',
                },
                methods: {
                    post: [async (req, res) => {
                        const { hotelID } = req.params;
                        if (req.files) {
                            const uploadPath = `${APP.BASE_DIR}/files/hotel`;
                            let   file       = req.files.image;
            
                            const filePath    = file.name.split('.');
                            const newFileName = `${stringUtils.md5((new Date()).getTime() + '_' + stringUtils.md5(file.name) + '_' + stringUtils.randomString())}.${filePath[ filePath.length - 1 ]}`;
            
                            file.mv(`${uploadPath}/${newFileName}`, function (err) {
                                if (err) return res.json({
                                    error  : true,
                                    message: 'cannot_update_image'
                                })
                            });
            
                            let uploadImage = await HOTEL_COLL.findByIdAndUpdate(hotelID, {
                                image: `/files/hotel/${newFileName}`
                            }, { new: true });
                            
                            if (!uploadImage) return res.json({ error: true, message: 'cannot_upload_image' });

                            res.json({ error: false, data: uploadImage });
                        }                        
                    }]
                },
            },

            '/detail-hotel/:hotelID': {
                config: {
                    auth: [ roles.role.all.bin ],
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
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listHotel = await HOTEL_MODEL.getListHotel();
                        res.json(listHotel);
                    }]
                },
            },

            '/remove-hotel/:hotelID': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let { hotelID } = req.params;
                        let removeHotel = await HOTEL_COLL.findByIdAndRemove(hotelID);
                        res.json(removeHotel);
                    }]
                },
            },

            '/update-hotel/:hotelID': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    post: [ async (req, res) => {
                        let { hotelID }                           = req.params;
                        let { title, description, review, price } = req.body;
                        let updateTrip                            = await HOTEL_MODEL.update(hotelID, title, description, review, price);
                        res.json(updateTrip);
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
                        let user                     = req.user.data_user;
                        let hotelID                  = '5c18d2a072618b2ad575afdc';
                        let { title, message, star } = req.body;
                        let insertResp               = await RATING_MODEL.insert(title, message, star, user._id, hotelID);
                        res.json(insertResp);
                    }]
                },
            },

            '/detail-rating/:ratingID': {
                config: {
                    auth: [ roles.role.all.bin ],
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

            '/list-rating': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let listRating = await RATING_MODEL.getListRatingWithHotel();
                        res.json(listRating);
                    }]
                },
            },
            
            // ========= == ======= CHATBOT ============ //
            '/chat-bot/:message': {
                config: {
                    auth: [ roles.role.all.bin ],
                    type: 'json',
                },
                methods: {
                    get: [ async (req, res) => {
                        let { message } = req.params;
                        let result      = await chatBotKit(message);
                        res.json({
                            score : result.response.score,
                            awnser: result.response.answer
                        });
                    }]
                },
            },
        }
    }
};
