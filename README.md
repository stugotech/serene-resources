
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

Alternatively, you can have the middleware load the resources descriptions from a directory, either by passing the path into the constructor, or by using the `load` method:

```js
service.use(new SereneResources(__dirname + '/resources'));
// equivalent to
service.use(new SereneResources().load(__dirname + '/resources'));
```

By default, it will recursively include all `.js` files in the specified directory, and the resource name will be the file name without extension, lower-cased.

You can have more control over it by passing in [require-all](https://www.npmjs.com/package/require-all) options to the `load` method, e.g.:

```js
service.use(new SereneResources().load({
  dirname: __dirname + '/resources'),
  filter: /(.+)Resource\.js$/
});
```

There is also a middleware called `SereneResources.Dispatcher`, which will dispatch requests to handlers on the resource object.  E.g.:

```js
let resources = {
  widgets: {
    list: function (request, response) {
      // this gets called when a list request is made to 'widgets'
    }
  }
};

service.use(new SereneResources(resources));
service.use(new SereneResources.Dispatcher());
```

In the example above, since only `list` is defined, any other request to the `widgets` resource will fail with HTTP 405.  You can override this behaviour and have processing continue to the next handler by passing `false` into the constructor.
