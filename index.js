
var NotFoundError = require('http-status-errors').NotFoundError;

module.exports = SereneResources;


function SereneResources(resources) {
  this.resources = resources;
}

SereneResources.prototype.handle = function (request, response) {
  var resource = this.resources[request.resourceName];

  if (!resource)
    throw new NotFoundError('resource not found: ' + request.resourceName);

  request.resource = resource;
  return response;
};
