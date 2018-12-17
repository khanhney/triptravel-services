"use strict";

let express = require('express'),
    cluster = require('cluster'),
    net = require('net'),
    sio = require('socket.io'),
    // sio_redis = require('socket.io-redis'),
    https = require('https'),
    farmhash = require('farmhash'),
    fs = require('fs');

const httpsConfig = require('./www/config/cf_https');
let num_processes = require('os').cpus().length;
let hostConf = require('./www/config/cf_host');
let stringUtils = require('./www/utils/string_utils');

exports.BASE_DIR = __dirname;
exports.EXPRESS = express;

let server;
let i;
if (cluster.isMaster) {
    let workers = [];
    let spawn = function (i) {
        i = Number(i);
        workers[ i ] = cluster.fork();
        workers[ i ].on('exit', function (code, signal) {
            spawn(i);
        });
    };

    for (i = 0; i < num_processes; i++) {
        spawn(i);
    }

    let worker_index = function (ip, len) {
        return farmhash.fingerprint32(stringUtils.listCharacter()[ i ]) % Number(len); // Farmhash is the fastest and works with IPv6, too
    };

    server = net.createServer({pauseOnConnect: true}, function (connection) {
        var worker = workers[ worker_index(connection.remoteAddress, num_processes) ];
        worker.send('sticky-session:connection', connection);
    }).listen(hostConf.post, hostConf.host), ()=>{
        console.log(`server start at port ${hostConf.host}:${hostConf.post}`)
    };

    let io = sio(server);

    // io.adapter(sio_redis({host: 'localhost', port: 6379}));
} else {
    let app = new express();
    server = app.listen(0, hostConf.host);

    let io = sio(server);
    if (httpsConfig.status) {
        app.use(function (req, res, next) {
            if (!/https/.test(req.protocol)) {
                res.redirect("https://" + req.headers.host + req.url);
            } else {
                return next();
            }
        });

        const options = {
            key: fs.readFileSync(__dirname + httpsConfig.key),
            cert: fs.readFileSync(__dirname + httpsConfig.cert),
            ca: fs.readFileSync(__dirname + httpsConfig.ca),
        };
        server = app.listen(0, hostConf.host);
        https.createServer(options, app).listen(443);
    } else {
        server = app.listen(0, hostConf.host, ()=>{
            console.log(`server start at port ${hostConf.host}:${hostConf.post}`)
        });
    }

    // io.adapter(sio_redis({host: 'localhost', port: 6379}));

    let socket = require('./www/socket/socket');
    socket(io);

    process.on('message', function (message, connection) {
        if (message !== 'sticky-session:connection') {
            return;
        }

        server.emit('connection', connection);
        connection.resume();
    });

    let config = require('./www/config/config');
    config(app, io);

    let routing = require('./www/routing/routing');
    routing.mainHandel(app, io);

    let localsRouting = require('./www/locals/locals_routing');
    localsRouting(app);
}