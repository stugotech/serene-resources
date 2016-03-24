
import Serene from 'serene';
import SereneResources from '../src/SereneResources'
import {expect} from 'chai';


describe('SereneResources', function () {
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
