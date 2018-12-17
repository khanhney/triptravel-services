"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');

const cfJws             = require('../config/cf_jws');
const { hash, compare } = require('bcrypt');
const { domain }        = require('../config/cf_host');
const jwt               = require('jsonwebtoken');
const USER_MODEL        = require('../database/user-coll');
class Model extends BaseModel {

    constructor() {
        super(require('../database/user-coll'))
    }

   static register(username, email, password) {
        const that = this;
        return new promise(async (resolve) => {
            try {
                  const check_exist = await USER_MODEL.findOne({
                        $or: [
                              { username: username },
                              { email: email }
                           ]
                  })
                  if (!check_exist) {
                        const hashPassword   = await hash(password, 8);
                        const user_save_init = new USER_MODEL({
                              username, email, password: hashPassword
                        });
                        const user_save = await user_save_init.save();
                        if (!user_save) {
                        return resolve({
                              error  : true,
                              message: "cannot_register"
                        })
                        }
      
                        // Send and Verify Mail 
                        const { verifyEmailUserImplement } = require('../mailer/module/mail_user');
                        const link                         = domain + 'xac-thuc-email/';
                        //Create Token
                        delete user_save.password;
                        jwt.sign(user_save.toJSON(), cfJws.secret, {
                        expiresIn: '48h'
                        }, function (err, token) {
                        if (err) return resolve({
                              error  : true,
                              message: err.message
                        });
                        verifyEmailUserImplement(user_save.username, user_save.email, link + token);
                        });
                        return resolve({
                        error: false,
                        data : user_save
                        });
                  }
                  else {
                        return resolve({
                        error  : true,
                        message: "userName_or_email_exist"
                        });
                  }
            } catch (error) {
               return resolve({
                  error  : true,
                  message: error.message
               });
            }

        })
    }
    
    static signIn (username_or_email, password) {
      const that = this;
      return new Promise(async resolve => {
            try {
                  let data_user = await USER_MODEL.findOne({
                        $or: [
                              { email: username_or_email },
                              { username: username_or_email }
                        ]
                  });
                  if (!data_user) {
                        return resolve({
                              error  : true,
                              message: "user_or_email_not_exist"
                        });
                  }
                  const check_password = await compare(password, data_user.password);
                  if (!check_password) {
                        return resolve({
                              error  : true,
                              message: "password_wrong"
                        });
                  }
                  // delete data_user.password;
                  const token = await jwt.sign({ data_user }, cfJws.secret);
                  console.log({ token });
                  return resolve({
                        error: false,
                        data : { data_user, token }
                  });
            } catch (error) {
                  return resolve({
                        error  : true,
                        message: "cannot_sign_in"
                  });
            }
      })
   }

   static getInfoUser(userId) {
      const that = this;
      return new Promise(async resolve => {
         try {
            let infoUser = await USER_MODEL.findById(userId);
            if (!infoUser) return resolve({ error: true, message: 'user_not_exist' });
            return resolve({ error: false, data: infoUser });
         } catch (error) {
            return resolve({
               error  : true,
               message: error.message
            })
         }
      })
   }
}

// module.MODEL = Model;
module.exports = Model;