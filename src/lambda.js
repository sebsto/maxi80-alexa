'use strict';

exports.context = function context() {

   var context = require('../test/context.json');

   //mostly used for compatibility with old Lambda function, not using callback
   context.done = function(error, result) {
       console.log('context.done');
       console.error(error);
       console.log(JSON.stringify(result, null, 2));
       process.exit();
   }
   context.succeed = function(result) {
       console.log('context.succeed');
       console.log(JSON.stringify(result, null, 2));
       process.exit();
   }
   context.fail = function(error) {
       console.error('context.fail');
       console.error(JSON.stringify(error, null, 2));
       process.exit();
   }

   return context;
}

exports.callback = function callback(error, result) {

    console.log('callback');
    if (error != undefined && error != null) {
        console.error(error);
    } else {
        console.log('error undefined or null');
    }
    if (result != undefined && result != null) {
        console.log(result);
    } else {
        console.log('result undefined or null');
    }
    process.exit();

}