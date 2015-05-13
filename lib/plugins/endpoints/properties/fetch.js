'use strict';

var Property = require('../../../models/property');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties/{propertyId}',
    config: {
      description: 'Show property',
      validate: {
        params: {
          propertyId: Joi.string().length(24)
        }
      },
      handler: function(request, reply){
        Property.findOne({managerId: request.auth.credentials._id, _id: request.params.propertyId}, function(err, property){
          return reply({property: property}).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'properties.fetch'
};
