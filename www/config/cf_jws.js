"use strict";


const databaseConfig = require('./cf_database');
const cfMode = require('./cf_mode');

let mongodUrl = "";
if (cfMode.database_product) {
    mongodUrl = `${databaseConfig.product._mongod_user === '' ? 'mongodb://' + databaseConfig.product._mongodb_host + ':' + databaseConfig.product._mongodb_port + '/' + databaseConfig.product._mongod_name :
        'mongodb://' + databaseConfig.product._mongod_user + ':' + databaseConfig.product._mongodb_pass + '@' + databaseConfig.product._mongodb_host + ':' + databaseConfig.product._mongodb_port + '/' + databaseConfig.product._mongod_name}`;
} else {
    mongodUrl = `${databaseConfig.iot_project._mongod_user === '' ? 'mongodb://' + databaseConfig.iot_project._mongodb_host + ':' + databaseConfig.iot_project._mongodb_port + '/' + databaseConfig.iot_project._mongod_name :
        'mongodb://' + databaseConfig.iot_project._mongod_user + ':' + databaseConfig.iot_project._mongodb_pass + '@' + databaseConfig.iot_project._mongodb_host + ':' + databaseConfig.iot_project._mongodb_port + '/' + databaseConfig.iot_project._mongod_name}`;
}

module.exports = {
    secret: 'cfgdyhgjdfghgdgdhey4eryt5t7iu7ygtrsgdhfhj678iujfgdfdnum8uoiujfg4566#%$^&%',
    url: mongodUrl
};
