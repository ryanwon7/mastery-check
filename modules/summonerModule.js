'use strict'
var EventEmitter = require('events').EventEmitter;

class summonerModule extends EventEmitter{
	constructor(){
		super();
	}
	summoner(){
		var self = this;
		this.emit('summoner')
	}
}

exports.summonderModule = summonderModule;
