"use strict";

const hostProduct = require('./cf_mode').host_product;

/**
 * [HOST-POST PRODUCT]
 */
exports.host_product = '';
exports.post_product = '';

/**
 * [HOST-POST DEVELOPMENT]
 */
exports.host_dev = 'localhost';
exports.post_dev = '6909';

/**
 * [HOST ROUTER]
 */

exports.host   = (!hostProduct) ? this.host_dev : this.host_product;
exports.post   = (!hostProduct) ? this.post_dev : this.post_product;
exports.domain = (!hostProduct) ? 'http://' + this.host_dev + ':' + this.post_dev + '/' : 'https://kof.com.vn';
