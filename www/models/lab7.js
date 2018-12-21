"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');
const LAB7_MODEL = require('../database/lab7');

class Model extends BaseModel {

    constructor() {
        super(require('../database/lab7'))
    }

    static insert(title, address, category) {
        return new promise(async (resolve) => {
            try {
                let initData = new LAB7_MODEL({ title, address, category });
                let saveData = await initData.save();
                return resolve({ erorr: false, data: saveData });
            } catch (error) {
                return resolve({ erorr: true, message: error.message });
            }
        })
    }
    static getList() {
        return new Promise(async resolve => {
            try {
                let list = await LAB7_MODEL.find({});
                if (!list) return resolve({ erorr: true, message: 'cannot_get_list' });
                return resolve({ erorr: false, data: list });
            } catch (error) {
                return resolve({ erorr: true, message: error.message });
            }
        });
    }
}

module.exports = Model;
