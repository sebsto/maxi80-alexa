'use strict';

import 'mocha';
import { expect } from 'chai';
import { RequestEnvelope, ResponseEnvelope } from 'ask-sdk-model';
import { handler as skill } from '../src/index';

import r from './request/repeat_intent.json'; // tslint:disable-line
const request: RequestEnvelope = <RequestEnvelope>r;

import { Assertion } from './utils/Assertion';
const A = new Assertion();

const USER_ID = "amzn1.ask.account.123";
let skill_response: ResponseEnvelope;


describe('Audio Player Test : RepeatIntent', function () {

  // pre-requisites
  before(async () => {

    this.timeout(5000);

    await skill(request, null, (error, responseEnvelope) => {
      skill_response = responseEnvelope;
    });
  });


  it('it responses with valid response structure ', () => {

    A.checkResponseStructure(skill_response);
  }),

    it('it responses with output speech ', () => {

      A.checkOutputSpeach(skill_response);
    }),

    it('it does not close the session ', () => {
      A.checkSessionStatus(skill_response, true);
    }),

    it('it responses with no directive ', () => {

      let r = skill_response.response;
      expect(r).to.not.have.property("directives");

    });
});