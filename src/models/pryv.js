/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
// @flow

import superagent from 'superagent';
import url from 'url';

// eslint-disable-next-line
import config from '@/utils/config';

const DEFAULT_DOMAIN = config.pryv.domain;
const APP_ID = 'pryv-campaign-manager';

/* eslint-disable prefer-promise-reject-errors */

class Pryv {
  domain: string;
  apiUrl: string;
  registerUrl: string;

  constructor (params: {
    domain: string
  }) {
    if (!params) {
      params = {domain: ''};
    }
    this.domain = params.domain || DEFAULT_DOMAIN;
    console.log('new Pryv. Domain : ' + this.domain);
  };

  isApiUrlSet () {
    return this.apiUrl != null;
  }

  isRegisterUrlSet () {
    return this.registerUrl != null;
  }

  async fetchServiceInfo () {
    // Already fetched
    if (this.isApiUrlSet()) {
      console.warn('service info already fetched');
      return;
    }

    console.log('fetching service info on ' + config.pryv.serviceInfoUrl);
    try {
      const serviceInfoRes = await superagent.get(config.pryv.serviceInfoUrl);
      this.apiUrl = serviceInfoRes.body.api || 'https://{username}.' + config.domain + '/';
      this.registerUrl = serviceInfoRes.body.register || 'https://reg.' + config.domain + '/';
      console.log('apiUrl set to ' + this.apiUrl);
      console.log('registerUrl set to ' + this.registerUrl);
    } catch (error) {
      console.error('Unable to reach service info at ' + config.pryv.serviceInfoUrl + ' : ' + JSON.stringify(error, null, 2));
    }
  }

  buildApiUrl (username: string, path: string) {
    if (!this.isApiUrlSet()) {
      console.error('api as not been set');
      return '';
    }

    return url.resolve(this.apiUrl.replace('{username}', username), path);
  }

  buildRegisterUrl (path: string) {
    if (!this.isRegisterUrlSet()) {
      console.error('register as not been set');
      return '';
    }

    return url.resolve(this.registerUrl, path);
  }

  getBaseUrl (username: string) {
    return this.buildApiUrl(username, '');
  }

  signIn (params: {
    username: string,
    password: string
  }): Promise<string> {
    return superagent
      .post(this.buildApiUrl(params.username, 'auth/login'))
      .send({
        username: params.username,
        password: params.password,
        appId: APP_ID
      });
  }

  async userExists (params: {
    username: string
  }) {
    const checkeUserUrl = this.buildRegisterUrl(params.username + '/check_username');
    console.log('checking if user ' + params.username + ' exists on ' + checkeUserUrl);
    const checkUsernameResponse = await superagent.get(checkeUserUrl);
    const isReserved: boolean = checkUsernameResponse.body.reserved;
    if (!isReserved) {
      return false;
    }
    const reason: string = checkUsernameResponse.body.reason;
    if (isReserved && (reason != null) && (reason === 'RESERVED_USER_NAME')) {
      return false;
    }
    return true;
  }

  async isTokenValid (params: {
    username: string,
    token: string
  }): Object {
    const accessInfoResponse = await superagent
      .get(this.buildApiUrl(params.username, 'access-info?auth=' + params.token));
    return accessInfoResponse.body;
  }

  async getFollowedSlices (params: {
    username: string,
    token: string
  }): Object {
    const followedSlicesResponse = await superagent
      .get(this.buildApiUrl(params.username, 'followed-slices?auth=' + params.token));
    return followedSlicesResponse.body.followedSlices;
  }

  async createSlice (params: {
    username: string,
    token: string,
    invitation: Object
  }): Object {
    const createSliceResponse = await superagent
      .post(this.buildApiUrl(params.username, 'followed-slices?auth=' + params.token))
      .send({
        accessToken: params.invitation.accessToken,
        name: params.invitation.requestee.pryvUsername + '-' + params.invitation.campaign.title,
        url: this.buildApiUrl(params.invitation.requestee.pryvUsername, '#/sharings/' + params.invitation.accessToken)
      });
    return createSliceResponse.body.followedSlice;
  }

  async deleteSlice (params: {
    username: string,
    token: string,
    slice: Object
  }): Object {
    const deleteSliceResponse = await superagent
      .delete(this.buildApiUrl(params.username, 'followed-slices/' + params.slice.id + '?auth=' + params.token));
    return deleteSliceResponse.body;
  }

  async getUsernameFromEmail (params: {
    email: string
  }) {
    const usernameResponse = await superagent
      .get(this.buildRegisterUrl(params.email + '/uid'));
    return usernameResponse.body.uid;
  }

  async getAccesses (params: {
    username: string,
    token: string
  }) {
    const getAccessesResponse = await superagent
      .get(this.buildApiUrl(params.username, 'accesses?auth=' + params.token));
    console.info('got access response', getAccessesResponse.body);
    return getAccessesResponse.body.accesses.filter((access) => {
      return access.name.startsWith('cm-') && (access.type === 'app');
    });
  }

  async deleteAccess (params: {
    username: string,
    token: string,
    accessId: string
  }): Object {
    const deleteAccessResponse = await superagent
      .delete(this.buildApiUrl(params.username, 'accesses/' + params.accessId + '?auth=' + params.token));
    console.info('access deleted, response:', deleteAccessResponse.body);
    return deleteAccessResponse.body.accessDeletion;
  }

  async updateProfile (params: {
    username: string,
    token: string,
    pryvUsername: string,
    pryvToken: string
  }): Object {
    const updateProfileResponse = await superagent.put(this.buildApiUrl(params.pryvUsername, 'profile/private'))
      .set('Authorization', params.pryvToken)
      .send({
        'campaign-manager': {
          username: params.username,
          token: params.token
        }
      });
    return updateProfileResponse.body;
  }
}

export default Pryv;
