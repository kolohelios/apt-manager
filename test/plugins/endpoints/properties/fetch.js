/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var Property = require('../../../../lib/models/property');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('GET /properties/{propertyid}', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should return Happy Trails property', function(done){
    server.inject({method: 'GET', url: '/properties/b00000000000000000000003', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.property.name).to.equal('Happy Trails');
      done();
    });
  });

  it('should return nothing', function(done){
    server.inject({method: 'GET', url: '/properties/b00000000000000000000003', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      console.log(response.result);
      expect(response.statusCode).to.equal(200);
      expect(response.result.property).to.be.null;
      done();
    });
  });
  it('should cause a db error', function(done){
    var stub = Sinon.stub(Property, 'findOne').yields(new Error());
    server.inject({method: 'GET', url: '/properties/b00000000000000000000003', credentials: {_id: 'a00000000000000000000099'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should cause a 400 error - not a property', function(done){
    server.inject({method: 'GET', url: '/properties/buzzardTheScriptKiddie', credentials: {_id: 'a00000000000000000000099'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
