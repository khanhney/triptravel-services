"use strict";

var roleCf = require('./../config/cf_role');


const initAuths = [
    require('./role/public'),
];

let allAuths = {};
initAuths.forEach(function (authorization, index) {
    if (allAuths[new authorization().basePath]) {
        allAuths[new authorization().basePath].push(authorization);
    } else {
        allAuths[new authorization().basePath] = [authorization];
    }
});

let initPasePath = [];

for (let key in allAuths) {
    initPasePath.push(key);
}

initPasePath.sort(function (a, b) {
    return b.length - a.length;
});

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substr(0, index) + chr + str.substr(index + 1);
}

function findMatchBaseUrl(url, urls) {
    url = url[0] === "/" ? setCharAt(url, 0, '') : url;

    let compare = [];
    urls.forEach(function (itemUrlCopare, index) {
        itemUrlCopare.key = itemUrlCopare.key[0] === "/" ? setCharAt(itemUrlCopare.key, 0, '') : itemUrlCopare.key;

        const count1 = countItemInc(url);
        const count2 = countItemInc(itemUrlCopare.key);
        let maxCountIndexEqual = 0;
        const maxCount = count1 < count2 ? count1 : count2;
        let blockCompare = false;
        for (let index = 0; index <= maxCount; index++) {
            if (!blockCompare) {
                if (getIndexIncPath(url, index) === getIndexIncPath(itemUrlCopare.key, index)) {
                    maxCountIndexEqual++;
                } else {
                    blockCompare = true;

                }
            }
        }

        compare.push({
            url: itemUrlCopare.key,
            index: itemUrlCopare.index,
            equal: maxCountIndexEqual
        });
    });

    compare.sort(function (a, b) {
        return b.equal - a.equal;
    });

    return compare[0];


    function getIndexIncPath(urlGET, index) {
        const arrIncs = urlGET.split("/");
        return arrIncs[index];
    }

    function countItemInc(urlGET) {
        const arrIncs = urlGET.split("/");
        return arrIncs.length;
    }
}

function checkBasePathInPath(path) {
    let routers;
    let basePathMain = null;

    let hasPath = false;
    initPasePath.forEach(function (basePath, index) {
        if (!hasPath && path.indexOf(basePath) === 0) {
            routers = allAuths[basePath];
            basePathMain = basePath;
            hasPath = true;
        }
    });

    if (basePathMain === null) {
        return null;
    } else {
        let realPath = path.replace(basePathMain, '');

        /**
         * tìm kiến xem có pẩm trên url hay không và điều hướng phù hợp
         */
        let detailUrl = {};
        let auths = allAuths[basePathMain];

        let detailBasePath = [];

        auths.forEach(function (auth, index) {
            const listDetail = new auth().registerRouting();
            for (let key in listDetail) {
                detailUrl[key] = index;
                detailBasePath.push({
                    key: key,
                    index: index
                });
            }
        });

        detailBasePath.sort(function (a, b) {
            return b.key.length - a.key.length;
        });

        var baseRealPath = realPath;

        let resultCheck = findMatchBaseUrl(realPath, detailBasePath);
        realPath = resultCheck.url;
        let router = routers[resultCheck.index];
        realPath = (realPath[0] === "/") ? realPath : "/" + realPath;

        return {basePath: realPath, baseRealPath: baseRealPath, router: router};
    }
}


function checkAuthorization(req, res, next) {
    let host = req.get('host');
    if (host.indexOf('www.') === 0) {
        host = host.replace('www.', '');
        return res.redirect(req.protocol + '://' + host + req.originalUrl);
    }

    let path = req.path;
    let auth = checkBasePathInPath(path);

    if (typeof auth === 'undefined' || auth === null) {
        if (initAuths.length === 1) {
            return res.redirect('/auth')
        } else return res.json({Error: 'BASE ROUTER NOT FOUND'});
    } else {
        const basePath = auth.basePath;
        const routerSetting = auth.router;
        const baseRealPath = auth.baseRealPath;

        const router = new routerSetting();

        const methods = router.registerRouting();
        if (typeof methods[basePath] === 'undefined' || methods[basePath] === null) {
            if (methods[baseRealPath] !== null) {
                res.bindingRole = methods[baseRealPath];

                roleCf.authorization(req, res, next)
            } else {

                /**
                 * trong link có thể có biến.
                 */
                let allBasePaths = [];
                for (let key in methods) {
                    allBasePaths.push(key);
                }

                allBasePaths.sort(function (a, b) {
                    return b.length - a.length;
                });

                let currentMethod;

                allBasePaths.forEach(function (itemBasePath, index) {
                    if (basePath.indexOf(itemBasePath) === 0) {
                        currentMethod = methods[itemBasePath];
                    }
                });

                if (typeof currentMethod === 'undefined' || currentMethod === null) {
                    return res.json({ERROR: 'METHOD NOT FOUND'});
                } else {
                    res.bindingRole = currentMethod;
                    roleCf.authorization(req, res, next)
                }
            }
        } else {
            res.bindingRole = methods[basePath];
            roleCf.authorization(req, res, next)
        }
    }
}

module.exports = {
    checkAuthorization: checkAuthorization,
    initAuths: initAuths
};