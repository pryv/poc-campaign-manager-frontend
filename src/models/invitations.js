// @flow

import superagent from 'superagent';

import config from '../../config';

class Invitations {
  username: string;
  token: string;
  campaignId: string;
  baseUrl: string;
  invitationId:? string;

  constructor (params: {
    token: string,
    username: string,
    campaignId: string,
    invitationId?: string,
  }) {
    this.token = params.token;
    this.username = params.username;
    this.baseUrl = config.dev.host +
      ':' + config.dev.port +
      '/' + this.username;
    this.campaignId = params.campaignId;
    this.invitationId = params.invitationId;
    console.log('baseurl:', this.baseUrl);
  }

  makeUrl (path: string): string {
    return this.baseUrl + path;
  }

  get (params: {
    username: string,
    campaignId: string,
    token: string
  }): Promise<any> {
    const url = this.makeUrl('/campaigns');
    console.info('doing invitations.get call to ', url);
    return superagent.get(url);
  }

  create (params: {
    requestee: string
  }): Promise<any> {
    const url = this.makeUrl('/invitations');
    console.info('doing invitations.create call to', url);
    return superagent.post(url)
      .send({
        invitation: {
          requester: this.username,
          requestee: params.requestee,
          campaignId: this.campaignId
        }
      });
  }
}

export default Invitations;
