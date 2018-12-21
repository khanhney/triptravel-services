"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema = require('mongoose').Schema;

module.exports  = BASE_COLL("lab7", {
   title      : String,
   address    : String,
   category   : { type: Number, default: 0 },
   createAt   : { type: Date, default: Date.now }
});