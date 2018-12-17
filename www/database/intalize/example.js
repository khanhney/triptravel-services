"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema    = require('mongoose').Schema;

module.exports  = BASE_COLL("name collection", {
    name: String
});