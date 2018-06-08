// @flow

import superagent from 'superagent';

import config from '../../config';

class Invitations {
  username: string;
  token: string;
  baseUrl: string;

  constructor (params: {
    token: string,
    username: string
  }) {
    this.token = params.token;
    this.username = params.username;
    this.baseUrl = config.dev.host +
      ':' + config.dev.port +
      '/' + this.username + '/invitations';
  }

  makeUrl (path?: string): string {
    return path ? this.baseUrl + '/' + path : this.baseUrl;
  }

  async get (params: {
    requester: string,
    token: string
  }): Promise<any> {
    const url = this.makeUrl();
    return superagent.get(url);
  }

  async create (params: {
    requestee?: string,
    requesteePryvUsername: string,
    status: string,
    campaignId: string
  }): Promise<any> {
    const url = this.makeUrl();
    return superagent.post(url)
      .send(params);
  }

  update (params: {
    invitation: Object
  }): Promise<mixed> {
    const url = this.makeUrl(params.invitation.id);
    console.info('doing invitations.update call to', url, 'with params', params);
    return superagent
      .put(url)
      .send({
        status: params.invitation.status,
        accessToken: params.invitation.accessToken
      });
  }
}

export default Invitations;
