// @flow

import superagent from 'superagent';
import _ from 'lodash';

import config from '../../config';

class Campaigns {
  baseUrl: string;

  constructor () {
    this.baseUrl = config.dev.host +
      ':' + config.dev.port +
      '/users';
  }

  makeUrl (username?: string): string {
    return username ? this.baseUrl + '/' + username : this.baseUrl;
  }

  getOne (params: {
    username: string,
    token: string
  }): Promise<mixed> {
    return superagent
      .get(this.makeUrl(params.username))
      .set('Authorization', params.token);
  }

  signIn (params: {
    username: string,
    password: string
  }): Promise<any> {
    const url = config.dev.host +
      ':' + config.dev.port + '/auth';
    console.info('doing users.signin call to', url);
    return superagent
      .post(url)
      .send(params);
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
    token: string,
    pryvUsername: string,
    pryvToken: string,
  }): Promise<mixed> {
    const url = this.makeUrl(params.username);
    console.info('doing users.update call to', url, 'with params', params);
    return superagent
      .put(url)
      .set('Authorization', params.token)
      .send(_.pick(params, ['username', 'pryvUsername', 'pryvToken']));
  }
}

export default Campaigns;
