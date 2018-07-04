// @flow

import superagent from 'superagent';
import config from '../../config';

const sha256: any = require('fast-sha256');
const nacl: any = require('tweetnacl');
nacl.util = require('tweetnacl-util');

class Campaigns {
  username: string;
  token: string;
  baseUrl: string;

  constructor (params: {
    token: string,
    username: string
  }) {
    if (params == null) {
      params = {
        token: '',
        username: ''
      };
    }

    this.token = params.token;
    this.username = params.username;
    this.baseUrl = config.dev.host +
      ':' + config.dev.port +
      '/' + this.username;
  }

  makeUrl (path: string): string {
    return this.baseUrl + path;
  }

  get (query: {
    username: string,
    token: string
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    return superagent.get(url)
      .set('authorization', this.token)
      .query(query);
  }

  getOne (query: {
    campaignId: string
  }): Promise<any> {
    const url = this.makeUrl('/campaigns/' + query.campaignId);
    return superagent.get(url)
      .set('authorization', this.token);
  }

  async getOneByAppId (params: {
    pryvUsername: string,
    pryvAppId: string,
    accessToken: string
  }): Object {
    const msg: number = Date.now() / 1000;
    const encodedToken: Uint8Array = nacl.util.decodeUTF8(params.accessToken);
    const encodedTimestamp: Uint8Array = nacl.util.decodeUTF8(msg + '');
    const hmaced: Array<any> = sha256.hmac(encodedToken, encodedTimestamp);

    const getCampaignResponse = await superagent
      .get(config.dev.host + ':' + config.dev.port + '/all/campaigns/title/' + params.pryvAppId)
      .query('message=' + msg)
      .query('signature=' + hmaced.toString())
      .query('pryvUsername=' + params.pryvUsername);
    console.info('fetched campaign from backend', getCampaignResponse.body);
    return getCampaignResponse.body.campaign;
  }

  create (query: {
    campaign: {
      title: string,
      description: string,
      permissions: Array<mixed>
    }
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    console.info('doing campaign.create call to', url);
    return superagent.post(url)
      .set('authorization', this.token)
      .send(query.campaign);
  }
}

export default Campaigns;
