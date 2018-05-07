<template>
  <div id="app">
    <img src="https://pryv.com/wp-content/themes/pryv/assets/images/logo-pryv.png">


      <h2>Campaigns</h2>
    <table>
        <thead>
            <tr>
                <th v-for="property in campaignProperties">
                    {{ property }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="campaign in campaigns">
                <td v-for="key in campaignProperties">
                    {{ campaign[key] }}
                </td>
            </tr>
        </tbody>

    </table>

    <router-view/>
  </div>
</template>

<script>
  import CampaignList from '@/components/CampaignList.vue';

  import Campaigns from '@/models/campaigns';

  const campaigns = new Campaigns({
    username: 'bob'
  });

export default {
  name: 'App',
  components: {
    CampaignList
  },
  data: function () {
    return {
      campaigns: [
        {
          title: 'campaign 1a',
          description: 'blop'
        },
        {
          title: 'campaign 2b',
          description: 'blip'
        }
      ],
      campaignProperties: [
        'title',
        'description',
        'permissions',
        'created',
        'pryvAppId'
      ]
    }
  },
  created: function () {
    this.getCampaigns();
  },
  methods: {
    async getCampaigns() {
      const response = await campaigns.get();

      console.info(`Found response: ${inspect(response.body)}`);

      this.campaigns = response.body.campaigns;
    }
  }
};

function inspect(item) {
  require('util').inspect(item, {showHidden: false, depth: null})
}
</script>

<style>
#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

table {
    border: 2px solid #42b983;
    border-radius: 3px;
    background-color: #fff;
}

th, td {
    min-width: 120px;
    padding: 10px 20px;
}

td {
    background-color: #f9f9f9;
}

th {
    background-color: #f0f0f0;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
