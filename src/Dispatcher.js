
import {MethodNotAllowedError} from 'http-status-errors';
import debug from 'debug';

const traceRequest = debug('serene-resources:dispatcher');


export default class Dispatcher {
  constructor(errorOnNoHandler) {
    this.errorOnNoHandler = typeof errorOnNoHandler === 'undefined' ? true : errorOnNoHandler;
  }

  handle(request, response) {
    if (!request.resource)
      throw new Error('no request.resource: you need to use SereneResources before SereneResources.Dispatcher');

    let handler = request.resource[request.operation.name];
    traceRequest(`dispatching ${request.operation.name}:${request.resourceName}`);

    if (handler) {
      traceRequest(`running handler ${handler.name || handler.toString()}`);
      return handler(request, response);

    } else if (this.errorOnNoHandler) {
      traceRequest('handler not found, errorOnNoHandler=true');
      throw new MethodNotAllowedError(`operation ${request.operation.name} not allowed for resource ${request.resourceName}`);
    }

    traceRequest('handler not found, continuing');
  }
};
