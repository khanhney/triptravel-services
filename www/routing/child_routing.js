"use strict";
let express = require('express');
let fs = require('fs');
let APP = require('../../app');
let url = require('url');

class ChildRouter{
    constructor(basePath) {
        this.basePath = basePath;
        this.registerRouting;
    }

    registerRouting() {
    }
    exportModule() {
        let router = express.Router();
        
        for (let basePath in this.registerRouting()) {
            const item = this.registerRouting()[basePath];
    
            if (typeof item.methods.post !== 'undefined' && item.methods.post !== null) {
                if (item.methods.post.length === 1) {
                    router.post(basePath, item.methods.post[0]);
                } else if (item.methods.post.length === 2) {
                    router.post(basePath, item.methods.post[0], item.methods.post[1]);
                }
            }

            if (typeof item.methods.get !== 'undefined' && item.methods.get !== null) {
                if (item.methods.get.length === 1) {
                    router.get(basePath, item.methods.get[0]);
                } else if (item.methods.get.length === 2) {
                    router.get(basePath, item.methods.get[0], item.methods.get[1]);
                }
            }

            if (typeof item.methods.put !== 'undefined' && item.methods.put !== null) {
                if (item.methods.put.length === 1) {
                    router.put(basePath, item.methods.put[0]);
                } else if (item.methods.put.length === 2) {
                    router.put(basePath, item.methods.put[0], item.methods.put[1]);
                }
            }

            if (typeof item.methods.delete !== 'undefined' && item.methods.delete !== null) {
                if (item.methods.delete.length === 1) {
                    router.delete(basePath, item.methods.delete[0]);
                } else if (item.methods.delete.length === 2) {
                    router.delete(basePath, item.methods.delete[0], item.methods.delete[1]);
                }
            }

        }
        return router;
    }

    /**
     * 
     * @param {*} msg 
     * @param {*} res 
     * @param {*} data 
     * @param {*} code
     * @param {*} status  tham số nhận biết lỗi
     */
    static responseError(msg, res, data, code, status) {
        if (code) {
            res.status(code);
        }
        return res.json({error: true, message: msg, data: data, status: status});
    }

    static response(response, data) {
        return response.json(data);
    }


    static responseSuccess(msg, res, data, code) {
        if (code) {
            res.status(code);
        }

        return res.json({error: false, message: msg, data: data});
    }

    static pageNotFoundJson(res) {
        res.status(404);
        return res.json({"Error": "Page not found!"});
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} data 
     * @param {*} title 
     * @param {*} SEO   obj PRODUCT for SEO
     */
    static renderToView(req, res, data, title, SEO) {
        data = typeof data === 'undefined' || data === null ? {} : data;

        if (title) {
            res.bindingRole.config.title = title;
        }

        // const ogTitle = "HELLO TITLE", ogDescription = "DESCRIPTION OF OG";
        SEO ? data.SEO = SEO.SEO.data : data.SEO = {};
        data.render = res.bindingRole.config;
        // data.og = { ogTitle, ogDescription };
        data.url = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
        });
        // data.language = langSession.getLang(req.session);


        return res.render(res.bindingRole.config.view, data);
    }

    static renderToPath(req, res, path, data) {
        data = data == null ? {} : data;
        data.render = res.bindingRole.config;
        return res.render(path, data);
    }

    static renderToViewWithOption(req, res, pathRender, data) {
        return res.render(pathRender, {data});
    }

    static redirect(res, path) {
        return res.redirect(path);
    }
}

module.exports = ChildRouter;