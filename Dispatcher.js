
var MethodNotAllowedError = require('http-status-errors').MethodNotAllowedError;

module.exports = Dispatcher;

function Dispatcher(errorOnNoHandler) {
  this.errorOnNoHandler = typeof errorOnNoHandler === 'undefined' ? true : errorOnNoHandler;
}

Dispatcher.prototype.handle = function (request, response) {
  if (!request.resource)
    throw new Error('no request.resource: you need to use SereneResources before SereneResources.Dispatcher');

  var handler = request.resource[request.operation];

  if (handler) {
    handler(request, response);
  } else if (this.errorOnNoHandler) {
    throw new MethodNotAllowedError('operation ' + request.operation + ' not allowed for resource ' + request.resourceName);
  }
};
