<template>
    <div id="CampaignDisplay">

        <h2>Campaign</h2>
        <Campaign :campaign="campaign"></Campaign>

        <br>
        <BackButton></BackButton>

        <v-snackbar
          v-model="snackbar.display"
          :color="snackbar.color"
          :timeout=6000
          :top="true"
        >
            {{ snackbar.text }}
            <v-btn
              dark
              flat
              @click="snackbar.display = false"
            >
                Close
            </v-btn>
        </v-snackbar>
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
          username: this.$route.query.username,
          token: this.$route.query.token,
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
        ],
        snackbar: {
          display: false,
          color: 'info',
          text: ''
        },
      }
    },
    computed: {
      createdReadable() {
        return new Date(this.campaign.created * 1000).toString();
      },
      isCampaignNotCancelled() {
        return ! (this.campaign.status === 'cancelled');
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
      },
      async cancelCampaign() {
        try {
          const response = await this.campaignsModel.cancel({
          campaignId: this.campaign.id,
          localAccessToken: this.requester.token,
          });
          console.info('cancelled campaign: ' + this.campaign.title);
          this.campaign = response.body.campaign;
          this.showSnackbar({
            color: 'success',
            text: 'Campaign cancelled.',
          });
        } catch (e) {
          console.error('error while cancelling campaign');
          console.error(e);
          this.showSnackbar({
            color: 'error',
            text: 'Error while cancelling campaign.',
          });
        }
      },
      showSnackbar(params) {
        this.snackbar.text = params.text;
        this.snackbar.color = params.color;
        this.snackbar.display = true;
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