"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema    = require('mongoose').Schema;

module.exports  = BASE_COLL("hotel", {
   title: String,
   description: String,
   review: Number,
   price: String,
   image: String
});