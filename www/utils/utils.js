"use strict";

exports.isEmpty = function (value) {
    return typeof value == 'string'
        && !value.trim()
        || typeof value == 'undefined'
        || value === null
        || value == undefined;
};

exports.isEmptyObject = function (obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
};

/**
 * kiểm tra mảng array có tồn tại giá trị hay không?
 * @param params
 * @returns {boolean}
 */
exports.checkParamsValidate = function (params) {
    var isParamIsValidate = true;
    params.forEach(function (item, index) {
        if (item == null || item.trim().length == 0) {
            isParamIsValidate = false;
        }
    });

    return isParamIsValidate;
};

exports.currencyFormat = function (number, fixLength) {
    if (fixLength == null) {
        let stringNum = number + '';
        let arrInc = stringNum.split('.');
        let fixNum = 0;
        if (arrInc.length == 2) {
            fixNum = arrInc[1].length;
        }

        fixNum = fixNum > 18 ? 18 : fixNum;

        return (Number(number)).toLocaleString('en-US', {minimumFractionDigits: fixNum});
    } else {
        return (Number(number)).toLocaleString('en-US', {minimumFractionDigits: fixLength});
    }
};

/**
 * tính khoảng cách giữ 2
 * @param lat1
 * @param long1
 * @param lat2
 * @param long2
 * @returns {number}
 */
exports.getDistanceFromLatLonInKm = function (lat1, long1, lat2, long2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(long2 - long1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
};

exports.randomIntBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};