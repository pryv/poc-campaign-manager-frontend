import superagent from 'superagent';

class Campaigns {
  constructor (params) {
    this.token = params.token;
    this.baseUrl = params.baseUrl;
  }

  makeUrl (path) {
    return this.baseUrl + path;
  }

  get (query = {}) {
    console.info('doing campaigns.get call');
    const url = this.makeUrl('/campaigns');
    return superagent.get(url)
      .query(query);
  }
}

export default Campaigns;
