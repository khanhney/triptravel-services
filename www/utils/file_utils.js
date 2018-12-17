"use strict";

const fs = require('fs');
let promise = require('bluebird');

exports.uploadFile = function (file, path, args, callback) {
    file.mv(path, function (err) {
        if (err) {
            callback(false, args);
        } else {
            callback(true, args);
        }
    });
};

exports.baseUploadImageCode = function (code, path) {
    return new promise(function (resolve, reject) {
        fs.writeFile(path, code.replace(/^data:image\/\w+;base64,/, ''), {encoding: 'base64'}, function (err) {
            fs.chmod(path, '0777');
            return resolve({error: false, message: 'Upload success'});
        });
    });
};

exports.baseUploadImageFile = function (file, path) {
    return new promise(function (resolve, reject) {
        if (file == null) {
            return resolve({error: true, message: 'File not found'});
        } else {
            file.mv(path, function (err) {
                if (err) {
                    return resolve({error: true, message: 'File does not upload'});
                } else {
                    return resolve({error: false, message: 'Upload success'});
                }
            });
        }
    });
};

exports.checkAndCreateFolder = function (path) {
    let incs = path.split("/");
    let baseBath = '';
    incs.forEach(function (inc, index) {
        if (inc.trim() != "") {
            baseBath = baseBath + '/' + inc.trim();
            if (!fs.existsSync(baseBath)) {
                fs.mkdirSync(baseBath, '0777');
            }
        }
    });
    return baseBath;
};


exports.deleteFile = function (path) {
    fs.exists(path, function (exists) {
        if (exists) {
            fs.unlink(path);
        }
    });
};