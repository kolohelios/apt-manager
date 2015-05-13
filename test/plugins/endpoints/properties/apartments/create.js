/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /properties/{propertyId}/apartments', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should create an apartment', function(done){
    server.inject({method: 'POST', url: '/properties/b00000000000000000000003/apartments', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'Flat5', rooms: '3', area: 900, rent: '1600', bathrooms: '2'}}, function(response){
      console.log(response.result);
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Happy Trails');
      expect(response.result._id.toString()).to.equal('b00000000000000000000003');
      done();
    });
  });
});
