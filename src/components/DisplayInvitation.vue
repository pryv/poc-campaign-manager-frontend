<template>
    <div id="DisplayInvitation">
        <h2>Campaign Invitation</h2>
        <table>
            <tr>
                <td>Title:</td>
                <td>{{ campaign.title }}</td>
            </tr>
            <tr>
                <td>Description:</td>
                <td>{{ campaign.description }}</td>
            </tr>
            <tr>
                <td>Permissions:</td>
                <td>{{ campaign.permissions }}</td>
            </tr>
            <tr>
                <td>Pryv App Id:</td>
                <td>{{ campaign.pryvAppId }}</td>
            </tr>
            <tr>
                <td>Created:</td>
                <td>{{ createdReadable }}</td>
            </tr>
            <tr>
                <td>Requester:</td>
                <td>{{ requester.username }}</td>
            </tr>
        </table>

        <br>

        <span id="pryv-button"></span><br>
        By signing here, you consent to participate to the campaign.

    </div>


</template>

<script>
  import Invitations from '@/models/invitations';
  import Campaigns from '@/models/campaigns';

  import * as pryv from 'pryv';

  var credentials = null;
  var pryvDomain = 'pryv.me';
  var requestedPermissions = [{
    // Here we request full permissions on a custom stream;
    // in practice, scope and permission level will vary depending on your needs
    streamId: 'example-app-id',
    defaultName: 'Example app',
    level: 'manage'
  }];

  var settings = {
    requestingAppId: 'example-app-id',
    requestedPermissions: requestedPermissions,
    spanButtonID: 'pryv-button',
    callbacks: {
      initialization: function () {
        // ...
      },
      needSignin: function (popupUrl, pollUrl, pollRateMs) {
        // ...
      },
      signedIn: function (authData) {
        credentials = authData;
        // ...
      },
      refused: function (code) {
        // ...
      },
      error: function (code, message) {
        // ...
      }
    }
  };

  pryv.Auth.config.registerURL.host = 'reg.' + pryvDomain;
  pryv.Auth.setup(settings);

  export default {
    name: 'DisplayInvitation',
    data () {
      return {
        invitationsModel: new Invitations({
          username: this.$route.query.username || 'bob',
          campaignId: this.$route.query.campaignId,
          token: 'TODO'
        }),
        campaignsModel: new Campaigns({
          username: this.$route.query.username || 'bob',
          token: 'TODO'
        }),
        requester: {
          username: this.$route.query.username ||'bob'
        },
        campaign: {
          id: this.$route.query.campaignId || 'c1n3ok12o3kn12ok3',
          title: 'Blood Pressure',
          description: 'The goal of this campaign is to review the blood pressure of patients aged 18-52 to improve their well-being.' +
          '\n\n' +
          'Study made by John Hopkins University',
          created: Date.now(),
          permissions: 'permissions array',
          pryvAppId: 'riva-blood-pressure'
        },
        columns: [
          'id',
          'title',
          'description',
          'created',
          'permissions'
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
        this.$router.replace('/account/' + this.user.username);
      },
      async getCampaign() {
        const response = await this.campaignsModel.getOne({
          campaignId: this.campaign.id
        });
        console.info('retrieved', response.body);
        this.campaign = response.body.campaign;
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #DisplayInvitation {
        width:100%;
        height:100%;
    }
    table {
        margin: 0 auto; /* or margin: 0 auto 0 auto */
    }
</style>