<template>
    <div id="CampaignDisplay">

        <h2>Campaign</h2>
        <Campaign :campaign="campaign"></Campaign>

        <br>
        <button v-on:click="back">Back</button>
    </div>


</template>

<script>
  import Campaigns from '@/models/campaigns';

  import Campaign from './bits/Campaign';

  import * as pryv from 'pryv';

  export default {
    name: 'CampaignDisplay',
    components: {
      Campaign
    },
    data () {
      return {
        campaignsModel: new Campaigns({
          username: this.$route.query.username || 'empty',
          token: 'TODO'
        }),
        requester: {
          username: this.$route.query.username ||'empty'
        },
        campaign: {
          id: this.$route.query.campaignId || 'empty'
        },
        columns: [
          'id',
          'title',
          'description',
          'created',
          'permissions',
          'pryvAppId',
          'invitationLink'
        ]
      }
    },
    computed: {
      createdReadable() {
        return new Date(this.campaign.created * 1000).toString();
      }
    },
    created() {
      this.getCampaign();
    },
    methods: {
      back() {
        this.$router.back();
      },
      async getCampaign() {
        const response = await this.campaignsModel.getOne({
          campaignId: this.campaign.id
        });
        console.info('retrieved', response.body);
        this.campaign = response.body.campaign;
        const camp = response.body.campaign;
        console.info('perms', response.body.campaign.permissions)
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #CampaignDisplay {
        width:100%;
        height:100%;
    }
    table {
        margin: 0 auto; /* or margin: 0 auto 0 auto */
    }
</style>