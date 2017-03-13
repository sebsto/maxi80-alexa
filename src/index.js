'use strict';

var alexa = require('alexa-sdk');
var constants = require('./constants');
var stateHandlers = require('./stateHandlers');
var audioEventHandlers = require('./audioEventHandlers');

exports.handler = function(event, context, callback){
    console.log("******************* REQUEST **********************");
    console.log(JSON.stringify(event, null, 2));
    var skill = alexa.handler(event, context);
    skill.appId = constants.appId;
    alexa.dynamoDBTableName = constants.dynamoDBTableName;
    skill.registerHandlers(
        stateHandlers,
        audioEventHandlers
    );
    skill.execute();
};
