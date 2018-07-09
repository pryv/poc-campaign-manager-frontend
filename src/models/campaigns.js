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

  constructor () {
    this.baseUrl = config.dev.host +
      ':' + config.dev.port;
  }

  makeUrl (path: string): string {
    return this.baseUrl + path;
  }

  get (params: {
    username: string,
    token: string
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    return superagent.get(url)
      .set('authorization', params.token)
      .query({ username: params.username });
  }

  getOne (query: {
    campaignId: string
  }): Promise<any> {
    const url = this.makeUrl('/campaigns/' + query.campaignId);
    return superagent.get(url);
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

  create (params: {
    campaign: {
      title: string,
      description: string,
      permissions: Array<mixed>
    },
    user: {
      username: string,
      token: string
    }
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    return superagent.post(url)
      .set('authorization', params.user.token)
      .send({
        campaign: params.campaign,
        user: {
          username: params.user.username
        }
      });
  }
}

export default Campaigns;
