"use strict";

var Backbone = require( "/libs/backbone-titanium" ),
		C = require( "appersonlabs.carbon" );

var ListingTab = Backbone.View.extend({
	events: {
		"click #tweetTableView": "fetch"
	},
	initialize: function(){
		this.collection.on( "reset", this.render, this );
		this.tweetTableView = C.UI.find( "#tweetTableView" );
		this.fetch();
	},
	
	fetch: function(){
		this.collection.fetch();
	},
	render: function(){
		var rows = this.collection.map( this.renderTableRow, this );
		this.tweetTableView.setData( rows );

	},
	renderTableRow: function( model ){
		// this would be much more fun with carbon template support (https://twitter.com/AppersonLabs/status/270654202487914497)
		return C.UI.create({
			"TableViewRow":{
				layout: "horizontal",
				children: [{
					"ImageView":{
						image: model.get( "profile_image_url" ),
						width: 50,
					}
				},{
						"Label": {
							text: model.get( "text" )
						}
					}]
			}
		});
	}
	//sync: Backbone.sync
});

module.exports = ListingTab;