// @flow

import superagent from 'superagent';
import config from '@/models/config';

class Campaigns {
  username: string;
  token: string;
  baseUrl: string;

  constructor () {
    this.baseUrl = config.hostname +
      ':' + config.port;
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
    pryvAppId: string,
  }): Object {
    const getCampaignResponse = await superagent
      .get(makeUrl('/campaigns/by-pryv-app-id/' + params.pryvAppId));
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
