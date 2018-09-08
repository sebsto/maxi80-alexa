'use strict';

import 'mocha';
import { expect } from 'chai';

import { interfaces, RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';

import { handler as skill } from '../src/index';
import { ddb } from '../src/DDBController';
import { audioData } from '../src/AudioAssets';

import r from './request/launch_request.json'; // tslint:disable-line
const request: RequestEnvelope = <RequestEnvelope>r;

import { Assertion } from './utils/Assertion';
const A = new Assertion();

const USER_ID = "amzn1.ask.account.123";
let skill_response: ResponseEnvelope;

describe('Audio Player Test : LaunchRequest with Jingle', function () {

  // pre-requisites
  before(() => {

    this.timeout(5000);

    return new Promise((resolve, reject) => {

      // dynamically change the request to avoid duplicating JSON requests
      r.request.locale = 'fr-CA';

      // prepare the database
      ddb.deleteFromDDB(USER_ID).then(data => {
        console.log("Finished preparing the database");
        skill(request, null, (error, responseEnvelope) => {
          skill_response = responseEnvelope;
          resolve();
        });
      });
    });
  });

  after(() => {
    //reset request as it is cached by TS / Node runtime
    r.request.locale = 'en-GB'
  });


  it('it responds with valid response structure fr-CA', () => {

    A.checkResponseStructure(skill_response);
  }),

  it('it responses with output speech fr-CA', () => {
    A.checkOutputSpeach(skill_response);
  }),

  it('it closes the session fr-CA', () => {
    A.checkSessionStatus(skill_response, true);
  }),

  it('it responses with AudioPlayer.Play directive fr-CA', () => {

    A.checkAudioPlayDirective(skill_response);


  });

  it('it plays jingle fr-CA', () => {

    let app = <interfaces.audioplayer.PlayDirective>skill_response.response.directives[0];
    expect(app).to.have.property("playBehavior");
    expect(app.playBehavior).to.be.equal("REPLACE_ALL");
    expect(app).to.have.property("audioItem");
    expect(app.audioItem).to.have.property("stream");
    expect(app.audioItem.stream).to.have.property("url");
    expect(app.audioItem.stream.url).to.match(/^https:\/\//);
    let jingleURL = audioData(request.request).startJingle;
    expect(app.audioItem.stream.url).to.be.equal(jingleURL);
    expect(app.audioItem.stream).to.have.property("token");
    expect(app.audioItem.stream).not.to.have.property("expectedPreviousToken");
    expect(app.audioItem.stream).to.have.property("offsetInMilliseconds");
    expect(app.audioItem.stream.offsetInMilliseconds).to.equal(0);

  });

});