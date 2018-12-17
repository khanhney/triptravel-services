"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');

const RATING_MODEL = require('../database/rating-coll');

class Model extends BaseModel {

    constructor() {
        super(require('../database/rating-coll'))
    }

    static insert(title, comment, star, userID, hotelID) {
        return new promise(async (resolve) => {
            try {
                let dataRating = new RATING_MODEL({ title, comment, star, user: userID, hotel: hotelID });
                let saveRating = await dataRating.save();
                if (!saveRating) return resolve({ error: true, message: 'cannot_save_rating' });
                return resolve({ error: false, data: saveRating });                
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getListRatingWithHotel(hotelID) {
        return new Promise(async resolve => {
            try {
                let listRating = await RATING_MODEL.find({ hotel: hotelID });
                if (!listRating) return resolve({ error: true, message: 'cannot_get_list' });

                return resolve({ error: false, data: listRating });
            } catch (error) {
                return resvolve({ error: true, message: error.message });
            }
        });
    }

    static getInfoRating(ratingID) {
        return new Promise(async resolve => {
            try {
                let infoRating = await RATING_MODEL.findById(ratingID);
                if (!infoRating) return resolve({ error: true, message: 'cannot_get_info_rating' });

                return resolve({ error: false, data: infoRating });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}

module.exports = Model;