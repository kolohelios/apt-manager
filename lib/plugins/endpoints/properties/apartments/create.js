'use strict';

// var Joi = require('joi');
var Property = require('../../../../models/property');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/properties/{propertyId}/apartments',
    config: {
      description: 'Create an apartment',
      handler: function(request, reply){
        Property.findOneAndUpdate({_id: request.params.propertyId, managerId: request.auth.credentials._id}, {$push: {apartments: request.payload}}, {new: true, select: '_uid, name'}, function(err, result){
          return reply(result).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'apartments.create'
};
