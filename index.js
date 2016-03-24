
var NotFoundError = require('http-status-errors').NotFoundError;
var requireAll = require('require-all');


module.exports = SereneResources;
module.exports.Dispatcher = require('./Dispatcher');


function SereneResources(resources) {
  if (typeof resources === 'string' || resources instanceof String) {
    this.load(resources);
  } else {
    this.resources = resources;
  }
}


SereneResources.prototype.load = function (options) {
  if (typeof options === 'string' || options instanceof String) {
    options = {
      dirname: options,
      recursive: true,
      filter: /(.+)\.js$/,
      map: function (name, path) {
        return name.toLowerCase();
      }
    };
  }

  this.resources = requireAll(options);
  return this;
};


SereneResources.prototype.handle = function (request, response) {
  var resource = this.resources[request.resourceName];

  if (!resource)
    throw new NotFoundError('resource not found: ' + request.resourceName);

  request.resource = resource;
};
