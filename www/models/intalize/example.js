"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');

class Model extends BaseModel {

    constructor() {
        super(require('../database/...'))
    }

    static insert() {
        const that = this;
        return new promise(async (resolve) => {

        })
    }
}

module.MODEL = Model;