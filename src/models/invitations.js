// @flow

import superagent from 'superagent';

import config from '@/models/config';

class Invitations {
  baseUrl: string;

  constructor () {
    this.baseUrl = config.hostname +
      ':' + config.port + '/invitations';
  }

  makeUrl (path?: string): string {
    return path ? this.baseUrl + '/' + path : this.baseUrl;
  }

  async get (params: {
    username: string,
    token: string
  }): Promise<any> {
    const url = this.makeUrl();
    return superagent.get(url)
      .set('authorization', params.token)
      .query({
        username: params.username
      });
  }

  async create (params: {
    requestee: {
      username?: string,
      pryvUsername?: string,
    },
    campaign: {
      id: string
    },
    status?: string,
    accessToken?: string
  }): Promise<any> {
    const url = this.makeUrl();
    return superagent.post(url)
      .send(params);
  }

  update (params: {
    id: string,
    accessToken?: string,
    status?: string,
  }): Promise<mixed> {
    const url = this.makeUrl(params.id);
    console.info('doing invitations.update call to', url, 'with params', params);
    return superagent
      .put(url)
      .send({
        status: params.status,
        accessToken: params.accessToken
      });
  }
}

export default Invitations;
