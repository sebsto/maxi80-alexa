'use strict';

var Alexa = require('alexa-sdk');
var audioData = require('./audioAssets');
var constants = require('./constants');

var stateHandlers = {
    'LaunchRequest': function () {
        this.emit('PlayAudio');
    },
    'PlayAudio': function () {
        // play the radio
        controller.play.call(this, `Welcome to ${audioData.title}`);
    },
    'AMAZON.HelpIntent': function () {
        var message = `Welcome to ${audioData.title}. I can bring you the best music of the eighties.`;
        this.response.speak(message);
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        // No session ended logic
    },
    'Unhandled': function () {
        var message = 'Sorry, I could not understand...';
        this.response.speak(message);
        this.emit(':responseReady');
    },

    'AMAZON.NextIntent': function () {
        this.response.speak('This is radio, you have to wait for next track to play.');
        this.emit(':responseReady');
    },
    'AMAZON.PreviousIntent': function () { 
        this.response.speak('This is radio, you can not go back in the playlist');
        this.emit(':responseReady');
    },

    'AMAZON.PauseIntent': function () { this.emit('AMAZON.StopIntent'); },
    'AMAZON.CancelIntent': function () { this.emit('AMAZON.StopIntent'); },
    'AMAZON.StopIntent': function () { controller.stop.call(this) },

    'AMAZON.ResumeIntent': function () { controller.play.call(this) },

    'AMAZON.LoopOnIntent': function () { this.emit('AMAZON.StartOverIntent'); },
    'AMAZON.LoopOffIntent': function () { this.emit('AMAZON.StartOverIntent');},

    'AMAZON.ShuffleOnIntent': function () { this.emit('AMAZON.StartOverIntent');},
    'AMAZON.ShuffleOffIntent': function () { this.emit('AMAZON.StartOverIntent');},

    'AMAZON.StartOverIntent': function () { 
        this.response.speak('This is radio, you can not do that.  You can say stop or pause to stop listening.');
        this.emit(':responseReady');
        
    },
    /*
     *  All Requests are received using a Remote Control. Calling corresponding handlers for each of them.
     */
    'PlayCommandIssued': function () { controller.play.call(this) },
    'PauseCommandIssued': function () { controller.stop.call(this) }
}

module.exports = stateHandlers;

var controller = function () {
    return {
        play: function (text) {
            /*
             *  Using the function to begin playing audio when:
             *      Play Audio intent invoked.
             *      Resuming audio when stopped/paused.
             *      Next/Previous commands issued.
             */

            if (canThrowCard.call(this)) {
                //TODO : add Maxi80 logo image
                var cardTitle = audioData.title;
                var cardContent = audioData.subtitle;
                var cardImage = audioData.image;
                this.response.cardRenderer(cardTitle, cardContent, cardImage);
            }

            this.response.speak(text).audioPlayerPlay('REPLACE_ALL', audioData.url, audioData.url, null, 0);
            this.emit(':responseReady');
        },
        stop: function () {
            /*
             *  Issuing AudioPlayer.Stop directive to stop the audio.
             *  Attributes already stored when AudioPlayer.Stopped request received.
             */
            this.response.speak("Good bye.").audioPlayerStop();
            this.emit(':responseReady');
        }
    }
}();

function canThrowCard() {
    /*
     * To determine when can a card should be inserted in the response.
     * In response to a PlaybackController Request (remote control events) we cannot issue a card,
     * Thus adding restriction of request type being "IntentRequest".
     */
    if (this.event.request.type === 'IntentRequest' || this.event.request.type === 'LaunchRequest') {
        return true;
    } else {
        return false;
    }
}

