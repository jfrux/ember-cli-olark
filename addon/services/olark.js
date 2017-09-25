import Ember from 'ember';
export default Ember.Service.extend(Ember.Evented, {
	olark: null,
  olarkInitPromise: null,
  OlarkInit() {
		if (this.olarkInitPromise) { return this.olarkInitPromise; }

		const ENV = Ember.getOwner(this).factoryFor('config:environment');

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
		let events = [
			"box.onHide",
			"box.onShow",
			"box.onExpand",
			"box.onShrink",
			"chat.onReady",
			"chat.onOperatorsAvailable",
			"chat.onOperatorsAway",
			"chat.onBeginConversation",
			"chat.onMessageToOperator",
			"chat.onMessageToVisitor",
			"chat.onCommandFromOperator",
			"chat.onOfflineMessageToOperator"
		];

		events.forEach((eventStr) => {
			let eventSplit = eventStr.split('.');
			let apiBlock = eventSplit[0];
			let eventName = eventSplit[1];

			this._bindEvent(apiBlock,eventName);
		})
		return this.olarkInitPromise;
  },
	_bindEvent(apiBlock,eventName) {
		let eventEmberName = eventName.replace('on','').camelize();
		this.olark(`api.${apiBlock}.${eventName}`,() => {
			this.trigger(eventEmberName);
		});
	},
	showBox() {
		return this.olark('api.box.show');
	},
	hideBox() {
		return this.olark('api.box.hide');
	},
	expandBox() {
		return this.olark('api.box.expand');
	},
	shrinkBox() {
		return this.olark('api.box.shrink');
	},
	setLocale(locale) {
		return this.olark('api.box.setLocale',locale);
	},
	getVisitorDetails() {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			this.olark("api.visitor.getDetails", function(details) {
				Ember.run(null, resolve, details);
			});
    });
	},
	updateVisitorNickname(snippet) {
		return this.olark('api.chat.updateVisitorNickname',{
        snippet: snippet
    })
	},
	updateVisitorStatus(snippet) {
		return this.olark('api.chat.updateVisitorStatus',{
        snippet: snippet
    })
	},
	updateVisitorFullName(fullName) {
		return this.olark('api.visitor.updateFullName',{
        fullName: fullName
    })
	},
	updateVisitorEmailAddress(emailAddress) {
		return this.olark('api.visitor.updateEmailAddress',{
        emailAddress: emailAddress
    })
	},
	updateVisitorPhoneNumber(phoneNumber) {
		return this.olark('api.visitor.updatePhoneNumber',{
        phoneNumber: phoneNumber
    })
	},
	updateVisitorCustomFields(fields) {
		return this.olark('api.visitor.updateCustomFields',fields);
	},
	updateVisitorCustomField(fieldName,fieldValue) {
		let fields = {};
		field[fieldName] = fieldValue;
		return this.olark('api.visitor.updateCustomFields',fields);
	}
});
