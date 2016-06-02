
import Dispatcher from '../src/Dispatcher';
import Serene from 'serene';
import SereneResources from '../src/SereneResources'
import {expect} from 'chai';

describe('Dispatcher', function () {
  let service, resources;

  beforeEach(function () {
    service = new Serene();

    resources = {
      widgets: {
        foo: 'bar'
      }
    };

    service.use(new SereneResources(resources));
  });

  it('should dispatch to resource-defined handler', function () {
    service.use(new Dispatcher());

    resources.widgets.list = function (request, response) {
      expect(request.resource.foo).to.equal('bar');
      response.result = 'hello';
    };

    return service.dispatch('list', 'widgets')
      .then(function (response) {
        expect(response.result).to.equal('hello');
      });
  });

  it('should 405 if handler isn\'t defined', function () {
    service.use(new Dispatcher());

    return service.dispatch('list', 'widgets')
      .then(
        function () {
          throw new Error('expected error');
        },
        function (err) {
          expect(err.status).to.equal(405);
        }
      );
  });

  it('should not 405 if asked not to', function () {
    service.use(new Dispatcher(false));

    service.use(function (request, response) {
      response.result = 'hello';
    });

    return service.dispatch('list', 'widgets')
      .then(function (response) {
        expect(response.result).to.equal('hello');
      });
  });

  it('should handle promises', function () {
    service.use(new Dispatcher());

    resources.widgets.list = function (request, response) {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          response.end();
          resolve();
        }, 100);
      });
    };

    service.use(function () {
      throw new Error('should not run');
    });

    return service.dispatch('list', 'widgets');
  });
});
