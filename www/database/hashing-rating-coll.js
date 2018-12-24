"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema    = require('mongoose').Schema;

// TABLE SAVE INFO HASHSTRING AFTER PUSH INFO RATING IN IPFS
module.exports  = BASE_COLL("hash_rating", {
    rating: {
        type: Schema.Types.ObjectId,
        ref: 'rating'
    },
    createAt: { type: Date, default: Date.now },
    hashStringIPFS: { type: String },
    hashTransaction: { type: String }
});