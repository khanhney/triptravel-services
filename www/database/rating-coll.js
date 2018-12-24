"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema = require('mongoose').Schema;

module.exports  = BASE_COLL("rating", {
    title  : String,
    comment: String,
    star   : { type: Number, default: 5 },
    user   : { 
       type: Schema.Types.ObjectId,
       ref : 'user'
    },
    hotel: {
       type: Schema.Types.ObjectId,
       ref : 'hotel'
    },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
    /**
     * 1. PUSHED BLOCKCHAIN
     * 0. NOT PUSH
     */
    status  : {
        type: Number,
        default: 0
    }
});