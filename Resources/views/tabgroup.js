"use strict";

var Backbone = require( "/libs/backbone-titanium" ),
		C = require( "appersonlabs.carbon" ),
		TweetsView,
		TweetsCollection;



var TabGroupView = Backbone.View.extend({
	el: C.UI.load( "/templates/tabgroup.json" ),
	initialize: function(){
		TweetsCollection = require( "/collections/tweets" );
		TweetsView = require( "/views/tweets" );
		this.tweetsTab = new TweetsView({
			el: this.el.tabs[0],
			collection: new TweetsCollection()
		});
		
	},

	open: function(){
		this.el.open();
		return this;
	}
});


module.exports = TabGroupView;