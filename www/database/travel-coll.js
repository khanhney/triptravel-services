"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema = require('mongoose').Schema;

module.exports  = BASE_COLL("travel", {
   title      : String,
   description: String,
//    image for API /files/trip/<file.png/jpg>
   image    : String,
   isFeature: { type: Number, default: 0 },
   price    : String,
   // Ngay xuat phat
   startTime: Date,
   status   : { type: Number, default: 1 },
   qrcode   : String
});