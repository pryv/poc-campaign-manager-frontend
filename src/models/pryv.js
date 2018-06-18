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

  async userExists (params: {
    username: string
  }) {
    try {
      console.log('callin userExists');
      await superagent
        .post('https://reg.' + this.domain + '/' + params.username + '/server');
    } catch (e) {
      console.log('error while making exists call', e);
      if (e.status === 404) {
        return false;
      }
    }
    return true;
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
