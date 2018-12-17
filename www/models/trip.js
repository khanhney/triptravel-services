"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');

const TRAVEL_MODEL = require('../database/travel-coll');

class Model extends BaseModel {

    constructor() {
        super(require('../database/travel-coll'));
    }

    static insert(title, description, isFeature, price, startTime) {
        return new promise(async (resolve) => {
            try {
                let infoTrip = new TRAVEL_MODEL({ title, description, isFeature, price, startTime });
                let saveTrip = await infoTrip.save();

                if (!saveTrip) return resolve({ error: true, message: 'cannot_insert_trip' });

                return resolve({ error: false, data: saveTrip });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static update(tripID, title, description, isFeature, price, startTime) {
        return new promise(async resolve => {
            try {
                let checkExist = await TRAVEL_MODEL.findById(tripID);
                if (!checkExist) return resolve({ error: true, message: 'cannot_exist_trip' });

                let updateTrip = await TRAVEL_MODEL.findByIdAndUpdate(tripID, {
                    title, description, isFeature, price, startTime
                }, { new: true });

                if (!updateTrip) return resolve({ error: true, message: 'cannot_update_trip' });

                return resolve({ error: false, data: updateTrip });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    
    static updateStatus(tripID, status) {
        return new promise(async resolve => {
            try {
                let checkExist = await TRAVEL_MODEL.findById(tripID);
                if (!checkExist) return resolve({ error: true, message: 'trip_not_exist' });

                let updateStatus = await TRAVEL_MODEL.findByIdAndUpdate(tripID, { status: status }, { new: true });
                if (!updateStatus) return resolve({ error: true, message: 'cannot_update_status' });

                return resolve({ error: false, data: updateStatus });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    

    static getDetail(tripID) {
        return new promise(async resolve => {
            try {
                let checkExist = await TRAVEL_MODEL.findById(tripID);

                if (!checkExist) return resolve({ error: true, message: 'cannot_get_detail' });

                return resolve({ error: false, data: checkExist });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
    
    static getListTrip() {
        return new Promise(async resolve => {
            try {
                let listTrip = await TRAVEL_MODEL.find({}).limit(9).exec();
                if (!listTrip) return resolve({ error: true, message: 'cannot_get_list_hotel' });
                
                return resolve({ error: false, data: listTrip });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            } 
        });
    }
}

module.exports = Model;