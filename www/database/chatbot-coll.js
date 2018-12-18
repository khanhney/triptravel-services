"use strict";

const BASE_COLL = require('./intalize/base-coll');

const Schema = require('mongoose').Schema;

module.exports  = BASE_COLL("chatbot", {
    message : String,
    createAt: { type: Date, default: Date.now },
    answer  : String,
    // SO SAO NGUOI DUNG DANH GIA DE CHUNG TA CO DU LIEU TRAINING TOT HON HE THONG NHUNG LAN TIEP THEO
    // 0: du lieu trung gian || ko co danh gia cua nguoi dung
    pointUserRating: { type: Number, default: 0 }
});