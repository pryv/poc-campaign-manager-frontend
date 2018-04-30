<template>
  <div id="app">
    <img src="https://pryv.com/wp-content/themes/pryv/assets/images/logo-pryv.png">
    <CampaignList
      v-for="campaign in campaigns"
      v-bind:name="campaign.name"
      v-bind:description="campaign.description">

    </CampaignList>
    <router-view/>
  </div>
</template>

<script>
  import CampaignList from '@/components/CampaignList.vue';

  import Campaigns from '@/models/campaigns';

  const campaigns = new Campaigns({
    baseUrl: 'http://localhost:9000'
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
          name: 'campaign 1a',
          description: 'blop'
        },
        {
          name: 'campaign 2b',
          description: 'blip'
        }
      ]
    }
  },
  created: function () {
    this.getCampaigns();
  },
  methods: {
    async getCampaigns() {
      let response = await campaigns.get();

      response = require('util').inspect(response)

      console.info(`Found response: ${response}`);
    }
  }
};
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
</style>
