[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-olark.svg)](http://emberobserver.com/addons/ember-cli-olark)

# ember-cli-olark

Simple Olark Service for your Ember CLI app.

This addon lets you inject, configure and interact with the Olark API.

[Olark API for Javascript reference doc](https://www.olark.com/api) for
details on the usage.

The methods implemented are:

* Convenience Methods
  - showButton
  - hideButton
  - showModal
  - hideModal

## Installation

* `ember install ember-cli-olark`

## Usage and configuration

### Configuration

Before using the [Olark JS API](https://www.olark.com/api) you need
to include it in your HTML. The most convenient way to do it is by using the addon service's OlarkInit method.
To do so, you must configure the parameters to use to initialize the Olark API in your `config/environment.js` file in the `OLARK` key.
The following is a basic example of such a configuration:

```js
  OLARK = {
    identity: 'YOUR IDENTITY KEY'
		configure: [ //NOT YET IMPLEMENTED
			{ 'system.hb_primary_color': '#744da8' }
		]
  }
```

You need to replace **YOUR IDENTITY KEY** with your own Olark Identity Key (which can be found in the original embed code provided by Olark)

### Usage
If you find yourself, needing the service in all your controllers you could inject the service by default in your controller like the following:

```js
export function initialize(application) {
  application.inject('controller', 'olark', 'service:olark');
}

export default {
  name: 'olark',
  initialize
};
```

### Initialize Olark

Before using Olark you must initialize it.
The most convenient way is to call the `OlarkInit` function of the `olark`
service in your `Application` route:

```js
import Ember from 'ember';
const {
	inject: {
		service
	}
}
export default Ember.Route.extend({
  olark: service(),

  beforeModel() {
    this.get('olark').OlarkInit();
  }
})
```

### Usage example

```js
import Ember from 'ember';

export default Ember.Route.extend({
  olark: Ember.inject.service(),

  actions: {
		openHelp() {
			this.get("olark").showModal();
		},
		closeHelp() {
			this.get("olark").hideModal();
		}
	}
});
```

## Running Tests

Before running tests, substitute any occurence of YOUR IDENTITY KEY in `tests/unit/services/olark-test.js` with your YOUR IDENTITY KEY.

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
