<template>
  <div id="app">
    <img src="https://pryv.com/wp-content/themes/pryv/assets/images/logo-pryv.png">
    <CampaignList
      v-for="campaign in campaigns" :key="campaign.title"
      v-bind:title="campaign.title"
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
          title: 'campaign 1a',
          description: 'blop'
        },
        {
          title: 'campaign 2b',
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
</style>
