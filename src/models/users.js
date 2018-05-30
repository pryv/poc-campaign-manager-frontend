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

  makeUrl (username?: string): string {
    return username ? this.baseUrl + '/' + username : this.baseUrl;
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

  update (params: {
    username: string,
    pryvUsername: string
  }): Promise<mixed> {
    const url = this.makeUrl(params.username);
    console.info('doing users.update call to', url);
    return superagent
      .put(url)
      .send(params);
  }
}

export default Campaigns;
