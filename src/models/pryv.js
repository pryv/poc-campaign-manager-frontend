// @flow

import superagent from 'superagent';

// eslint-disable-next-line
import config from '@/utils/config';

const DEFAULT_DOMAIN = config.pryv.domain;
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

  async userExists (params: {
    username: string
  }) {
    const checkUsernameResponse = await superagent.get('https://reg.' + this.domain + '/' + params.username + '/check_username');
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
      .get('https://' + params.username + '.' + this.domain + '/access-info?auth=' + params.token);
    return accessInfoResponse.body;
  }

  async getFollowedSlices (params: {
    username: string,
    token: string
  }): Object {
    const followedSlicesResponse = await superagent
      .get('https://' + params.username + '.' + this.domain + '/followed-slices?auth=' + params.token);
    return followedSlicesResponse.body.followedSlices;
  }

  async createSlice (params: {
    username: string,
    token: string,
    invitation: Object
  }): Object {
    const createSliceResponse = await superagent
      .post('https://' + params.username + '.' + this.domain + '/followed-slices?auth=' + params.token)
      .send({
        accessToken: params.invitation.accessToken,
        name: params.invitation.requestee.pryvUsername + '-' + params.invitation.campaign.title,
        url: 'https://' + params.invitation.requestee.pryvUsername + '.' + this.domain + '/#/sharings/' + params.invitation.accessToken
      });
    return createSliceResponse.body.followedSlice;
  }

  async deleteSlice (params: {
    username: string,
    token: string,
    slice: Object
  }): Object {
    const deleteSliceResponse = await superagent
      .delete('https://' + params.username + '.' + this.domain + '/followed-slices/' + params.slice.id + '?auth=' + params.token);
    return deleteSliceResponse.body;
  }

  async getUsernameFromEmail (params: {
    email: string
  }) {
    const usernameResponse = await superagent
      .get('https://reg.' + this.domain + '/' + params.email + '/uid');
    return usernameResponse.body.uid;
  }

  async getAccesses (params: {
    username: string,
    token: string
  }) {
    const getAccessesResponse = await superagent
      .get('https://' + params.username + '.' + this.domain + '/accesses?auth=' + params.token);
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
      .delete('https://' + params.username + '.' + this.domain + '/accesses/' + params.accessId + '?auth=' + params.token);
    console.info('access deleted, response:', deleteAccessResponse.body);
    return deleteAccessResponse.body.accessDeletion;
  }
}

export default Pryv;
