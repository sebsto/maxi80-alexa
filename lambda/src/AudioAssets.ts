'use strict';

import { interfaces,Response,Request, IntentRequest} from 'ask-sdk-model';
let en = {
    card: {
        title: 'Maxi 80',
        text: 'The best eighties music\n\nVisit our web site https://www.maxi80.com',
        image: {
            largeImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-1200.png',
            smallImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-720.png'
        }
    },
    url: 'https://audio1.maxi80.com',
    startJingle: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/jingle.m4a'
};

let fr = {
    card: {
        title: 'Maxi 80',
        text: 'La radio de toute une génération\n\nVisitez notre site web https://www.maxi80.com',
        image: {
            largeImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-1200.png',
            smallImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-720.png'
        }
    },
    url: 'https://audio1.maxi80.com',
    startJingle: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/jingle.m4a'
};

let es = {
    card: {
        title: 'Maxi 80',
        text: 'La radio de toda una generación\n\nVisita nuestro sitio web https://www.maxi80.com',
        image: {
            largeImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-1200.png',
            smallImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-720.png'
        }
    },
    url: 'https://audio1.maxi80.com',
    startJingle: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/jingle.m4a'
};
let it = {
    card: {
        title: 'Maxi 80',
        text: 'La radio di un\'intera generazione\n\nVisita il nostro sito https://www.maxi80.com',
        image: {
            largeImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-1200.png',
            smallImageUrl: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/alexa-artwork-720.png'
        }
    },
    url: 'https://audio1.maxi80.com',
    startJingle: 'https://s3-eu-west-1.amazonaws.com/alexa.maxi80.com/assets/jingle.m4a'
};

let globalAudioData = {
        'en-US': en,
        'en-GB': en,
        'en-CA': en,
        'en-IN': en,
        'en-AU': en,
        'fr-FR': fr,
        'fr-CA': fr,
        'es-ES': es,
        'es-MX': es,
        'it-IT': it
};

export function audioData(request : Request) {
    let DEFAULT_LOCALE = 'en-US';
    var locale = request.locale;
    if (locale === undefined) { 
        locale = DEFAULT_LOCALE
    };
    return globalAudioData[locale];    
}

