// @flow

import superagent from 'superagent';

import config from '../../config';

class Campaigns {
  baseUrl: string;

  constructor (params: {
  }) {
    this.baseUrl = config.dev.host +
      ':' + config.dev.port +
      '/users';
  }

  makeUrl (): string {
    return this.baseUrl;
  }

  create (payload: {
    username: string,
    pryvUsername: string
  }): Promise<any> {
    const url = this.makeUrl();
    console.info('doing users.create call to', url);
    return superagent.post(url)
      .send(payload);
  }
}

export default Campaigns;
