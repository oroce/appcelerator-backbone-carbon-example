var Backbone = require( "/libs/backbone-titanium" );

var TweetsCollection = Backbone.Collection.extend({
	url: "http://search.twitter.com/search.json?q=javascript",
	parse: function( res ){
		if( !res ){
			return res;
		}
		return res.results;
	}
});

module.exports = TweetsCollection;