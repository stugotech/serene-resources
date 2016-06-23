
import requireAll from 'require-all';
import {NotFoundError} from 'http-status-errors';
import debug from 'debug';

const traceRequest = debug('serene-resources:request');


export default class SereneResources {
  constructor(resources) {
    if (typeof resources === 'string' || resources instanceof String) {
      this.load(resources);
    } else {
      this.resources = resources;
    }
  }


  load(options) {
    if (typeof options === 'string' || options instanceof String) {
      options = {
        dirname: options,
        recursive: true,
        filter: /(.+)\.js$/,
        map: (name) => name.toLowerCase()
      };
    }

    this.resources = requireAll(options);
    return this;
  }


  handle(request, response) {
    traceRequest(`setting resource for ${request.resourceName}`)
    let resource = this.resources[request.resourceName];

    if (!resource)
      throw new NotFoundError(`resource not found: ${request.resourceName}`);

    request.resource = resource;
  }
};
