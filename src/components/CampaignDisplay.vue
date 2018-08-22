<template>
    <div id="CampaignDisplay">

        <h2>Campaign</h2>
        <Campaign :campaign="campaign"></Campaign>

        <SentInvitations :invitations="invitations"></SentInvitations>

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
  import Invitations from '@/models/invitations';
  import Pryv from '@/models/pryv';

  import Campaign from './bits/Campaign';
  import BackButton from './bits/BackButton';
  import SentInvitations from './bits/SentInvitations';

  import helpers from '@/utils/helpers';

  import * as pryv from 'pryv';

  export default {
    name: 'CampaignDisplay',
    components: {
      Campaign,
      BackButton,
      SentInvitations,
    },
    data () {
      return {
        campaignsModel: new Campaigns(),
        invitationsModel: new Invitations(),
        pryvModel: new Pryv(),
        requester: {
          username: this.$route.query.username,
          token: this.$route.query.token,
        },
        campaign: {
          id: this.$route.query.campaignId
        },
        invitations: [],
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
      this.getInvitations();
    },
    methods: {
      async getInvitations() {
        try {
          const response = await this.invitationsModel.get({
            username: this.requester.username,
            token: this.requester.token
          });
          console.info('retrieved invitations', response.body.invitations);
          let retrievedInvitations = response.body.invitations;
          this.invitations = retrievedInvitations.filter(i => i.campaign.id === this.campaign.id);

          this.invitations.forEach(async (i) => {
            i.created = helpers.printDate(i.created);
            i.modified = helpers.printDate(i.modified);
            i.permissions = i.campaign.permissions;
            if (i.history != null) {
              i.history.forEach((hi) => {
                hi.modified = helpers.printDate(hi.modified);
                if (hi.accessToken == null) {
                  hi.accessToken = 'N/A';
                }
              });
            }

            if (i.status == 'accepted') {
              this.checkInvitationToken({ invitation: i });
            }
          });
        } catch (e) {
          console.error('error while retrieving invitations', e);
        }
      },
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
      },
      async checkInvitationToken(params) {
        console.info('verifying invitation token for user', this.requester.username, 'for campaign', params.invitation.campaign.title);
        try {
          const accessInfo = await this.pryvModel.isTokenValid({
            username: params.invitation.requestee.pryvUsername,
            token: params.invitation.accessToken
          });
          console.info('valid token', accessInfo);
        } catch (e) {
          if (e.response && e.status && (e.status === 401)) {
            params.invitation.status = 'refused';
            console.info('token has been refused by the requestee');
            await this.updateInvitation(params.invitation);
          } else {
            console.error('error retrieving access info', e);
          }
        }
      },
      async updateInvitation(invitation) {
        try {
          await this.invitationsModel.refuse({
            invitationId: invitation.id,
          });
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.reponse;
          } else {
            errorData = e;
          }
          console.error('error while updating invitation status', errorData);
        }
      },
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