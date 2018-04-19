'use strict';

import { ResponseFactory } from 'ask-sdk-core';
import { ui, Response, interfaces } from 'ask-sdk-model';

class AudioController {

    play(url: string, offset: number, text?: string, cardData?: ui.StandardCard): Response {
        /*
             *  Using the function to begin playing audio when:
             *      Play Audio intent invoked.
             *      Resuming audio when stopped/paused.
             *      Next/Previous commands issued.
             */

        /*
           https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#play
           REPLACE_ALL: Immediately begin playback of the specified stream, and replace current and enqueued streams.             
        */
        const result = ResponseFactory.init();

        if (cardData) {
            result.withStandardCard(cardData.title, cardData.text, cardData.image.smallImageUrl, cardData.image.largeImageUrl);
        }

        // we are using url as token as they are all unique
        result
            .addAudioPlayerPlayDirective('REPLACE_ALL', url, url, offset, url)
            .withShouldEndSession(true);

        if (text) {
            result.speak(text);
        }

        const response = result.getResponse();

        // add support for radio meta data.  
        // this is not supported by the SDK yet, so it should be handled manually
        if (cardData) {

            const directive = <interfaces.audioplayer.PlayDirective>response.directives[0]
            directive.audioItem['metadata'] = {
                title: cardData.title,
                subtitle: cardData.text,
                art: {
                    contentDescription: cardData.title,
                    sources: [{
                        url: "https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-720.png"
                    }]
                },
                backgroundImage: {
                    contentDescription: cardData.title,
                    sources: [{
                        url: "https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-1200.png"
                    }]
                }
            };
        }

        return response;
    }


    playLater(url: string): Response {
        /*
           https://developer.amazon.com/docs/custom-skills/audioplayer-interface-reference.html#play
           REPLACE_ENQUEUED: Replace all streams in the queue. This does not impact the currently playing stream. 
         */
        const result = ResponseFactory.init();
        result
            .addAudioPlayerPlayDirective('REPLACE_ALL', url, url, 0, url)
            .withShouldEndSession(true);

        return result.getResponse();
    }

    stop(text: string): Response {
        /*
         *  Issuing AudioPlayer.Stop directive to stop the audio.
         *  Attributes already stored when AudioPlayer.Stopped request received.
         */
        const result = ResponseFactory.init();
        result
            .addAudioPlayerStopDirective()
            .speak(text);

        return result.getResponse();
    }

    clear(): Response {
        /*
         * Clear the queue and stop the player
         */
        const result = ResponseFactory.init();
        result.addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

        return result.getResponse();
    }
}
export const audio = new AudioController();