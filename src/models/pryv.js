// @flow

import superagent from 'superagent';

const DEFAULT_DOMAIN = 'pryv.me';
const APP_ID = 'pryv-campaign-manager';

class Pryv {
  domain: string;

  constructor (params: {
    domain: string
  }) {
    if (!params) {
      params = {domain: ''};
    }
    this.domain = params.domain || DEFAULT_DOMAIN;
  };

  signIn (params: {
    username: string,
    password: string
  }): Promise<string> {
    return superagent
      .post('https://' + params.username + '.' + this.domain + '/auth/login')
      .send({
        username: params.username,
        password: params.password,
        appId: APP_ID
      });
  }

  async isTokenValid (params: {
    username: string,
    token: string
  }): Object {
    const accessInfoResponse = await superagent
      .get('https://' + params.username + '.' + this.domain + '/access-info?auth=' + params.token);
    return accessInfoResponse.body;
  }
}

export default Pryv;
