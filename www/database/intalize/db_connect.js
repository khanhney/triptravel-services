"use strict";

let mongoose = require('mongoose');
const databaseConfig = require('../../config/cf_database');

const mongodUrl = databaseConfig._mongod_user === '' ? 'mongodb://' + databaseConfig._mongodb_host + ':' + databaseConfig._mongodb_port + '/' + databaseConfig._mongod_name :
    'mongodb://' + databaseConfig._mongod_user + ':' + databaseConfig._mongodb_pass + '@' + databaseConfig._mongodb_host + ':' + databaseConfig._mongodb_port + '/' + databaseConfig._mongod_name;

mongoose = mongoose.createConnection(mongodUrl);

module.exports = mongoose;