
import {MethodNotAllowedError} from 'http-status-errors';

export default class Dispatcher {
  constructor(errorOnNoHandler) {
    this.errorOnNoHandler = typeof errorOnNoHandler === 'undefined' ? true : errorOnNoHandler;
  }

  handle(request, response) {
    if (!request.resource)
      throw new Error('no request.resource: you need to use SereneResources before SereneResources.Dispatcher');

    let handler = request.resource[request.operation.name];

    if (handler) {
      return handler(request, response);
      
    } else if (this.errorOnNoHandler) {
      throw new MethodNotAllowedError(`operation ${request.operation.name} not allowed for resource ${request.resourceName}`);
    }
  }
};
