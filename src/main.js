// the role ARN to assume for any AWS SDK related calls
// the role must have a trusted policy with
// "lambda.amazonaws.com" and "arn:aws:iam::<YOUR ACCOUNT ID>:user/<YOUR USER>"
/*
 Example :
 {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com",
        "AWS": "arn:aws:iam::486652066693:user/sst"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
*/

"use strict";

var roleArn = 'arn:aws:iam::486652066693:role/alexa-audio-player';
var region  = 'eu-west-1';
//var event = require('../test/input_hello_intent.json');
//var event = require('../test/input_launch_request.auth.json');
//var event = require('../test/input_messagereceived.json');
let event = require(process.argv[2]);


/* DO NOT MAKE CHANGE BELOW THIS */

var lambda = require('./lambda');
var skill  = require('./index');
var AWS    = require('aws-sdk');

// use 'alexa' profile on locale machine to assume role
// see http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-multiple-profiles
var credentials = new AWS.SharedIniFileCredentials({profile: 'alexa'});
AWS.config.credentials = credentials;
AWS.config.region = region;
var sts = new AWS.STS();

sts.assumeRole({
    RoleArn: roleArn,
    RoleSessionName: 'emulambda'
}, function(err, data) {
    if (err) { // an error occurred
        console.error('Can not assume role');
        console.error(err, err.stack);
    } else { // successful response
        console.log('Role ' + roleArn + ' succesfully assumed.');
        //console.log(data);

        //update global AWS object
        AWS.config.update({
            accessKeyId: data.Credentials.AccessKeyId,
            secretAccessKey: data.Credentials.SecretAccessKey,
            sessionToken: data.Credentials.SessionToken
        });

        //make sure other modules including aws-sdk will receive this global object
        var Module = require('module');
        var originalRequire = Module.prototype.require;
        Module.prototype.require = function(){
          if (arguments[0] === 'aws-sdk'){
            return AWS;
          } else {
            return originalRequire.apply(this, arguments);
          }
        };

        console.log('**************************************************************');
        console.log('** Lambda Test Harness : Now Launching your lambda function **');
        console.log('**************************************************************');
        skill.handler(event, lambda.context(), lambda.callback);
    }
});
