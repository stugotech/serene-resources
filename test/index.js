
var expect = require('chai').expect;
var Serene = require('serene');
var SereneResources = require('../index');


describe('serene-resources', function () {
  var service;

  beforeEach(function () {
    service = new Serene();

    service.use(new SereneResources({
      widgets: {
        foo: 'bar'
      }
    }));
  });

  it('should set request.resource to the specified resource', function () {
    service.use(function (request, response) {
      expect(request.resource).to.eql({
        foo: 'bar'
      });

      return response;
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
