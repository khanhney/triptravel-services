"use strict";

const promise = require('bluebird');

const BaseModel = require('./intalize/base_model');
const RATING_MODEL = require('../database/rating-coll');
const HashIPFS = require('../database/hashing-rating-coll'); 

const IPFS = require('ipfs-mini');
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

const axios = require('axios');

class Model extends BaseModel {

    constructor() {
        super(require('../database/rating-coll'))
    }

    static insert(title, comment, star, userID, hotelID) {
            return new promise(async (resolve) => {
            try {
                let dataRating = new RATING_MODEL({ title, comment, star, user: userID, hotel: hotelID });
                let saveRating = await dataRating.save();
                if (!saveRating) return resolve({ error: true, message: 'cannot_save_rating' });

                /**
                 * PUSH INTO IPFS (DECENTRALIZED DATABASE)
                 */
                ipfs.add(JSON.stringify(saveRating), async (err, hash) => {
                    if (err) {
                        return console.log(err);
                    }
                    // console.log('HASH:=', hash);
                    const initHash = new HashIPFS({ rating: saveRating._id, hashStringIPFS: hash });
                    const saveHash = await initHash.save();

                     /**
                     * CALL API SERVER BLOCKCHAIN
                     */
                    axios.post('http://localhost:9256/add-rating-blockchain', {
                        hashString: hash
                      })
                      .then(async (response) => {
                          let dataResp = response.data.data;
                          let updateAddHashTransaction = await HashIPFS.findByIdAndUpdate(saveHash._id, {
                            hashTransaction: dataResp.hash
                          }, { new: true });
                          if (!updateAddHashTransaction) return resolve({ error: true, message: 'cannot_update_hash_trasaction' });
                          return resolve({ error: false, data: updateAddHashTransaction });
                      })
                      .catch(function (error) {
                        return resolve({ error: true, message: error.message });
                      });

                      /**
                       * END CALL
                       */
                });
                /**
                 * END PUSH IPFS
                 */

               
                

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static getListRating() {
        return new Promise(async resolve => {
            try {
                let listRating = await RATING_MODEL.find({}).populate('user').populate('hotel');
                if (!listRating) return resolve({ error: true, message: 'cannot_get_list' });
                return resolve({ error: false, data: listRating });
            } catch (error) {
                return resvolve({ error: true, message: error.message });
            }
        });
    }

    static getListRatingWithHotel(hotelId) {
        return new Promise(async resolve => {
            try {
                let listRating = await RATING_MODEL.find({ hotel: hotelId }).populate('user').populate('hotel');
                // let listRating = await RATING_MODEL.find({}).populate('user').populate('hotel');
                if (!listRating) return resolve({ error: true, message: 'cannot_get_list' });
                return resolve({ error: false, data: listRating });
            } catch (error) {
                return resvolve({ error: true, message: error.message });
            }
        });
    }

    static getInfoRating(ratingID) {
        return new Promise(async resolve => {
            try {
                let infoRating = await RATING_MODEL.findById(ratingID);
                if (!infoRating) return resolve({ error: true, message: 'cannot_get_info_rating' });

                return resolve({ error: false, data: infoRating });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }

    static getInfoRatingInIPFS (hashStringIPFS) {
        return new Promise(async resolve => {
            try {
                ipfs.catJSON(hashStringIPFS, (err, resultIPFS) => {
                    if (err) return resolve({
                        error: true,
                        message: 'cannot_get_data_ipfs'
                    });
                    return resolve({
                        error: false,
                        data: resultIPFS
                    })
                });
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}

module.exports = Model;