/* global describe beforeEach */

var Blockchain = require('../')
var url = 'https://api.blocktrail.com/cb/v0.2.1/tBTC'

describe('Common-blockchain automated tests', function () {
  var options = {}

  beforeEach(function () {
    options.blockchain = new Blockchain(url, { api_key: 'c0bd8155c66e3fb148bb1664adc1e4dacd872548' })
    options.blockchain.xhrOptions = {
      timeout: 1000000
    }
  })

  require('cb-tester')(options)
})
