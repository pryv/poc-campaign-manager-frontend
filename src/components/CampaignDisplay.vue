<template>
    <div id="CampaignDisplay">

        <h2>Campaign</h2>
        <Campaign :campaign="campaign"></Campaign>

        <br>
        <BackButton></BackButton>
    </div>


</template>

<script>
  import Campaigns from '@/models/campaigns';

  import Campaign from './bits/Campaign';
  import BackButton from './bits/BackButton';

  import * as pryv from 'pryv';

  export default {
    name: 'CampaignDisplay',
    components: {
      Campaign,
      BackButton
    },
    data () {
      return {
        campaignsModel: new Campaigns(),
        requester: {
          username: this.$route.query.username
        },
        campaign: {
          id: this.$route.query.campaignId
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