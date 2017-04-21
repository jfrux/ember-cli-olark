import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
	olark: null,
  olarkInitPromise: null,
  OlarkInit() {
		if (this.olarkInitPromise) { return this.olarkInitPromise; }

		const ENV = Ember.getOwner(this)._lookupFactory('config:environment');

		if (ENV.OLARK && ENV.OLARK.skipInit) {
			this.olarkInitPromise = Ember.RSVP.Promise.resolve('skip init');
			return this.olarkInitPromise;
		}

		var original = window.onloadstaticolarkcomjsclientappjs;
		var initSettings = ENV.OLARK;
		if (!initSettings || !initSettings.identity) {
			return Ember.RSVP.reject('No settings for init');
		}

		this.olarkInitPromise = new Ember.RSVP.Promise(function(resolve){
			// window.onloadstaticolarkcomjsclientappjs = function() {
			// 	console.log("onOlarkLoad!");
			// 	console.log("olarkIdentity:",initSettings.identity);
			//
			// 	Ember.run(null, resolve);
			// };
			(function(o,l,a,r,k,y) {
				if(o.olark)return; r="script";
				y=l.createElement(r);
				r=l.getElementsByTagName(r)[0];
				y.async=1;
				y.src="//"+a;
				r.parentNode.insertBefore(y,r);
				y=o.olark=function(){
					k.s.push(arguments);
					k.t.push(+new Date)
				};
				y.extend=function(i,j){
					y("extend",i,j)
				};
				y.identify=function(i){
					y("identify",k.i=i)
				};
				y.configure=function(i,j){
					y("configure",i,j);
					k.c[i]=j};
					k=y._={
						s:[],
						t:[+new Date],
						c:{},
						l:a
					};
				})(window,document,"static.olark.com/jsclient/loader.js");

			window.olark.identify(initSettings.identity);


			Ember.run(null, resolve);
		});
		this.olark = window.olark;
		this.configure = window.olark.configure;
		return this.olarkInitPromise;
  },
	showChatBox() {
		this.olark('api.box.show');
	},
	hideChatBox() {
		this.olark('api.box.hide');
	},
	expandChatBox() {
		this.olark('api.box.expand');
	}
});
