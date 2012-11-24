/*jshint eqnull:true expr:true*/

"use strict";

var _ = require( "tipm-underscore" ),
		superagent = require( "tipm-superagent" ),
		Carbon = require( "appersonlabs.carbon" ),
		Backbone = require( "/libs/backbone" );

var getValue = function(object, prop) {
	if (!(object && object[prop])) return null;
	return _.isFunction(object[prop]) ? object[prop]() : object[prop];
};

// Throw an error when a URL is needed, and none is supplied.
var urlError = function() {
	throw new Error('A "url" property or function must be specified');
};

var View = Backbone.View.extend({
		_configure: function(){
			this._eventRefs = {};
			return Backbone.View.prototype._configure.apply( this, arguments );
		},
		_ensureElement: function(){
			if( !this.el ){
				this.el = this.make( this.tagName, getValue( this, "attributes" ) );
			}
		},
		make: function( tagName, attributes ){
			var obj = {};
			if( typeof tagName === "string" ){
				obj[ tagName ] = attributes;
				return this.$.UI.create( obj );
			}
			return tagName( attributes );
		},
		delegateEvents: function( events ){
			return this._eventDelegator( true, events );
		},
		undelegateEvents: function( events ){
			return this._eventDelegator( false, events );
		},
		_eventDelegator: function( isAdd, events ){
			events = events || this.events;
			
			if( events == null || typeof events !== "object" ){
				return;
			}
			for( var key in events ){
				if( events.hasOwnProperty( key ) ){
					var params = key.split( /\s/ ),
						eventName = params[ 0 ],
						view,
						callback = this[ events[ key ] ];
					if( !params[ 1 ] ){
						view = this.el;
					}
					else{
						view = Carbon.UI.find( params[ 1 ] );
					}

					if( !view ){
						throw new Error( "element cannot be undefined, for key: "+ key );
					}

					if( !_.isFunction( callback ) ){
						throw new Error( "callback ('"+ callback +"') should be a function for key: "+ key );
					}
					
					if( !isAdd && this._eventRefs[ key + events[ key ] ] ){
						view.removeEventListener( eventName, this._eventRefs[ key + events[ key ] ] );
						continue;
					}
					
					
					var eventRef = _.bind( callback, this );
					if( isAdd ){
						this._eventRefs[ key + events[ key ] ] = eventRef;
					}
					view[ ( isAdd ? "add": "remove" ) +"EventListener" ]( eventName, eventRef );
				}
			}
		},
});

var methodMap = {
	"create": "POST",
	"update": "PUT",
	"delete": "DELETE",
	"read":   "GET"
};


Backbone.sync = function(method, model, options) {
	var type = methodMap[method],
			xhr;

	// Default options, unless specified.
	options || (options = {});

	// Default JSON-request options.
	var params = {type: type, dataType: "json"};

	// Ensure that we have a URL.
	if (!options.url) {
		params.url = getValue(model, "url") || urlError();
	}

	// Ensure that we have the appropriate request data.
	if (!options.data && model && (method == "create" || method == "update")) {
		params.contentType = "application/json";
		params.data = JSON.stringify(model.toJSON());
	}

	// For older servers, emulate JSON by encoding the request into an HTML-form.
	if (Backbone.emulateJSON) {
		params.contentType = "application/x-www-form-urlencoded";
		params.data = params.data ? {model: params.data} : {};
	}

	// For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	// And an `X-HTTP-Method-Override` header.
	if (Backbone.emulateHTTP) {
		if (type === "PUT" || type === "DELETE") {
			if (Backbone.emulateJSON){
				params.data._method = type;
			}
			params.type = "POST";
			params.beforeSend = function(xhr) {
				xhr.setRequestHeader("X-HTTP-Method-Override", type);
			};
		}
	}

	// Don't process data on a non-GET request.
	if (params.type !== "GET" && !Backbone.emulateJSON) {
		params.processData = false;
	}

	// Make the request, allowing the user to override any Ajax options.
	_.extend(params, options);

	return superagent
		[ params.type.toLowerCase() ]( params.url )
		.set( "Content-Type", params.contentType||"application/json" )
		.send( params.data )
		.on( "error", function( err ){
			params.error( err, err.status, err );
		})
		.end(function( res ){
			params.success( res.body, res.status, res );
		});
};


var klasses = _.extend({}, Backbone, {
	View: View
});

klasses.setDomLibrary( Carbon );
module.exports = klasses;
//for(var klass in klasses ){
	//if( klasses.hasOwnProperty( klass ) ){
//		exports[ klass ] = klasses[ klass ];
	//}
//}