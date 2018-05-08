// @flow

import superagent from 'superagent';

import config from '../../config';

class Campaigns {
  username: string;
  token: string;
  baseUrl: string;

  constructor (params: {
    token: string,
    username: string
  }) {
    console.log('creating campaign model, config:', config);

    this.token = params.token;
    this.username = params.username;
    this.baseUrl = config.dev.host +
      ':' + config.dev.port +
      '/' + this.username;
    console.log('baseurl:', this.baseUrl);
  }

  makeUrl (path: string): string {
    return this.baseUrl + path;
  }

  get (query: {
    username: string,
    token: string
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    console.info('doing campaigns.get call to ', url);
    return superagent.get(url)
      .query(query);
  }

  create (query: {
    campaign: {
      title: string,
      description: string,
      pryvAppId: string,
      permissions: Array<mixed>
    }
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    console.info('doing campaign.create call to', url);
    return superagent.post(url)
      .send(query.campaign);
  }
}

export default Campaigns;
