// @flow

import superagent from 'superagent';
import pathjs from 'path';

// eslint-disable-next-line
import config from '@/utils/config';

const DEFAULT_DOMAIN = config.pryv.domain;
const APP_ID = 'pryv-campaign-manager';

/* eslint-disable prefer-promise-reject-errors */ // TODO ilia : ok ?

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
  };

  isApiUrlSet () {
    console.info('isApiUrlSet : ' + (!!this.apiUrl).toString());
    return !!this.apiUrl;
  }

  isRegisterUrlSet () {
    return !!this.registerUrl;
  }

  async fetchServiceInfo () {
    // Already fetched
    if (this.isApiUrlSet()) {
      console.warn('service info already fetched');
      return;
    }

    try {
      const serviceInfoRes = await superagent.get(config.pryv.serviceInfoUrl);
      this.apiUrl = serviceInfoRes.body.api;
      this.registerUrl = serviceInfoRes.body.register;
      console.info('apiUrl : ' + this.apiUrl + ' / registerUrl : ' + this.registerUrl);
    } catch (error) {
      console.info('Unable to reach service info at ' + config.pryv.serviceInfoUrl + ' : ' + JSON.stringify(error, null, 2));
    }
  }

  buildApiUrl (username: string, path: string) {
    if (!this.isApiUrlSet()) {
      console.error('api as not been set');
      return '';
    }

    return pathjs.join(this.apiUrl.replace('{username}', username), path);
  }

  buildRegisterUrl (path: string) {
    if (!this.isRegisterUrlSet()) {
      console.error('register as not been set');
      return '';
    }

    return pathjs.join(this.registerUrl, path);
  }

  signIn (params: {
    username: string,
    password: string
  }): Promise<string> {
    if (!this.isApiUrlSet()) { // TODO ilia : double check ?
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'signIn - Pryv is not initialized'}});
      });
    }
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
    if (!this.isRegisterUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        // reject(new Error('PryvYYY is not initialized'));
        // reject(new Error({error: 'PryvYYY is not initialized'}));
        reject({error: {message: 'userExists - Pryv is not initialized'}});
      });
    }
    const checkUsernameResponse = await superagent.get(this.buildRegisterUrl(params.username + '/check_username'));
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
    console.info('testing TOKEN : ' + params.token);
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({message: 'isTokenValid - Pryv is not initialized'});
      });
    }
    const accessInfoResponse = await superagent
      .get(this.buildApiUrl(params.username, 'access-info?auth=' + params.token));
    return accessInfoResponse.body;
  }

  async getFollowedSlices (params: {
    username: string,
    token: string
  }): Object {
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'getFollowedSlices - Pryv is not initialized'}});
      });
    }
    const followedSlicesResponse = await superagent
      .get(this.buildApiUrl(params.username, 'followed-slices?auth=' + params.token));
    return followedSlicesResponse.body.followedSlices;
  }

  async createSlice (params: {
    username: string,
    token: string,
    invitation: Object
  }): Object {
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'createSlice - Pryv is not initialized'}});
      });
    }
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
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'deleteSlice - Pryv is not initialized'}});
      });
    }
    const deleteSliceResponse = await superagent
      .delete(this.buildApiUrl(params.username, 'followed-slices/' + params.slice.id + '?auth=' + params.token));
    return deleteSliceResponse.body;
  }

  async getUsernameFromEmail (params: {
    email: string
  }) {
    if (!this.isRegisterUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'getUsernameFromEmail - Pryv is not initialized'}});
      });
    }
    const usernameResponse = await superagent
      .get(this.buildRegisterUrl(params.email + '/uid'));
    return usernameResponse.body.uid;
  }

  async getAccesses (params: {
    username: string,
    token: string
  }) {
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'getAccesses - Pryv is not initialized'}});
      });
    }
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
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'deleteAccess - Pryv is not initialized'}});
      });
    }
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
    if (!this.isApiUrlSet()) { // TODO ilia : idem
      return new Promise(function (resolve, reject) {
        reject({error: {message: 'updateProfile - Pryv is not initialized'}});
      });
    }
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
