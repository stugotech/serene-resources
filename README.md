
# serene-resources

Serene middleware to add a resource description to the request.

## Installation

    $ npm install --save serene-resources

## Usage

```js
import Serene from 'serene';
import SereneResources from 'serene-resources';

let service = new Serene();

let resources = {
  widgets: {
    // stuff describing the widgets resource
  },
  sprockets: {
    // stuff describing the sprockets resource
  }
};

service.use(new SereneResources(resources));

service.use(function (request, response) {
  // request.resource will be one of the values from the resources hash
});
```

Define a hash with keys relating to each resource that you want to handle requests for, and values containing whatever your application needs.  Requests to valid resources will result in the downstream handlers being able to access the relevant value from the `request.resource` field, and requests to invalid resources will result in a 404 error.
