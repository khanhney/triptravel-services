"use strict";

const hostProduct = require('./cf_mode').host_product;
const HOST = require('./cf_host');

module.exports = {

    'facebookAuth': {
        'clientID': '', // your App ID
        'clientSecret': '', // your App Secret
        'callbackURL': hostProduct ? 'https://kof.com.vn' :
            'http://' + HOST.host + ':' + HOST.post + '/auth/login-fb/callback'
    },

    'twitterAuth': {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:8080/auth/google/callback'
    }

};