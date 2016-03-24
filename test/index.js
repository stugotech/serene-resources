
var expect = require('chai').expect;
var Serene = require('serene');
var SereneResources = require('../index');


describe('serene-resources', function () {
  var service, resources;

  beforeEach(function () {
    service = new Serene();

    resources = {
      widgets: {
        foo: 'bar'
      }
    };

    service.use(new SereneResources(resources));
  });

  describe('SereneResources', function () {
    it('should set request.resource to the specified resource', function () {
      service.use(function (request, response) {
        expect(request.resource).to.eql({
          foo: 'bar'
        });
      });

      return service.dispatch('list', 'widgets');
    });

    it('should return not found if the resource is not in the resources list', function () {
      return service.dispatch('list', 'sprockets')
        .then(
          function () {
            throw new Error('expected error');
          },
          function (err) {
            expect(err.status).to.equal(404);
          }
        );
    });
  });

  describe('SereneResources.Dispatcher', function () {
    it('should dispatch to resource-defined handler', function () {
      service.use(new SereneResources.Dispatcher());

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
      service.use(new SereneResources.Dispatcher());

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
      service.use(new SereneResources.Dispatcher(false));

      service.use(function (request, response) {
        response.result = 'hello';
      });

      return service.dispatch('list', 'widgets')
        .then(function (response) {
          expect(response.result).to.equal('hello');
        });
    });
  });
});
