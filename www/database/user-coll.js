"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema    = require('mongoose').Schema;

module.exports  = BASE_COLL("user", {
    username: { type: String, unique: true, trim: true }, 
    email   : { type: String, unique: true, trim: true },
    password: String
});