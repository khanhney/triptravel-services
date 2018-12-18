"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');

const HOTEL_MODEL = require('../database/hotel-coll');

class Model extends BaseModel {

    constructor() {
        super(require('../database/hotel-coll'))
    }

    static insert(title, description, review, price) {
        const that = this;
        return new promise(async (resolve) => {
            try {
                let hotelData = new HOTEL_MODEL({ title, description, review, price });
                let saveHotel = await hotelData.save();
                if (!saveHotel) return resolve({ error: true, message: 'cannot_insert_hotel' });
                return resolve({ error: false, data: saveHotel });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    
    static update(hotelID, title, description, review, price) {
        const that = this;
        return new Promise(async resolve => {
            try {
                let checkExist = await HOTEL_MODEL.findById(hotelID);
                if (!checkExist) return resolve({ error: true, message: 'hotel_not_exist' });
                
                let updateHotel = await HOTEL_MODEL.findByIdAndUpdate(hotelID, {
                    $set: {
                        title, description, review, price, updateAt: Date.now()
                    }
                }, { new: true });
                if (!updateHotel) return resolve({ error: true, message: 'cannot_update_hotel' });

                return resolve({ error: false, data: updateHotel });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getInfo(hotelID) {
        const that = this;
        return new Promise(async resolve => {
            try {
                let infoHotel = await HOTEL_MODEL.findById(hotelID);
                if (!infoHotel) return resolve({ error: true, message: 'cannot_find_info_hotel' });
                return resolve({ error: false, data: infoHotel });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static updateStatus(hotelID, status) {
        const that = this;
        return new Promise(async resolve => {
            try {
                let checkExistHotel = await HOTEL_MODEL.findById(hotelID);
                if (!checkExistHotel) return resolve({ error: true, message: 'hotel_not_exist' });

                let updateHotel = await HOTEL_MODEL.findByIdAndUpdate(hotelID, { status: status }, { new: true });

                if (!updateHotel) return resolve({ error: true, message: 'cannot_update_hotel' });

                return resolve({ error: false, data: updateHotel });
            } catch (error) {
                return resvolve({ error: true, message: error.message });
            }
        });
    }

    static getListHotel() {
        return new Promise(async resolve => {
            try {
                let listHotel = await HOTEL_MODEL.find({}).limit(9).exec();
                if (!listHotel) return resolve({ error: true, message: 'cannot_get_list_hotel' });
                
                return resolve({ error: false, data: listHotel });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            } 
        });
    }
}

module.exports = Model;