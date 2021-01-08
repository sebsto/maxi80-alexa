'use strict';

import 'mocha';
import { expect, should } from 'chai';
import { ddb } from '../src/DDBController';
import { Constants } from '../src/Constants';

const USER_ID = "amzn1.ask.account.123";

describe('Audio Player Test : Local DynalmoDB Table exist', function () {

  // pre-requisites
  before(async () => {

    this.timeout(5000);

  });

  it('it uses local dynamodb', () => {

    expect(Constants.useLocalDB).to.be.true;

  });

  it('it has a local database table', async () => {

    await ddb.getFromDDB(USER_ID).catch(async (reason) => {
      expect(reason).to.have.property('code');
      if ( reason.code === 'ResourceNotFoundException' ) {
        await ddb.createTable().then((value) => {
          expect(value).to.have.property('TableDescription');  
          expect(value.TableDescription).to.have.property('TableStatus');  
          expect(value.TableDescription.TableStatus).to.equal('ACTIVE');
        });
      } else {
        expect.fail(reason)
      }
    });

  });
});