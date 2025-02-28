/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
// @flow

import superagent from 'superagent';

// eslint-disable-next-line
import config from '@/utils/config';

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

  async accept (params: {
    invitationId: string,
    pryvAccessToken: string,
  }): Promise<mixed> {
    const url = this.makeUrl(params.invitationId) + '/accept';
    console.info('accepting invitation ' + params.invitationId);
    return superagent
      .post(url)
      .send({ accessToken: params.pryvAccessToken });
  }

  async refuse (params: {
    invitationId: string,
  }): Promise<mixed> {
    const url = this.makeUrl(params.invitationId) + '/refuse';
    console.info('refusing invitation ' + params.invitationId);
    return superagent
      .post(url)
      .send({});
  }
}

export default Invitations;
