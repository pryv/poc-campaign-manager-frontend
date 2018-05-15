<template>
    <div id="InvitationDisplay">
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

  export default {
    name: 'InvitationDisplay',
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
          title: 'empty',
          description: 'empty',
          created: Date.now(),
          permissions: 'empty',
          pryvAppId: 'empty'
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
        const camp = response.body.campaign;
        console.info('perms', response.body.campaign.permissions)
        this.loadButton();
      },
      loadButton() {
        let credentials = null;
        const pryvDomain = 'pryv.me';

        var settings = {
          requestingAppId: this.campaign.pryvAppId,
          requestedPermissions: this.campaign.permissions,
          spanButtonID: 'pryv-button',
          callbacks: {
            initialization: function () {

            },
            needSignin: function (popupUrl, pollUrl, pollRateMs) {
              // ...
            },
            signedIn: function (authData) {
              credentials = authData;
              this.invitations.create({
                campaignId: this.campaign.id,
                requester: this.requester.username,
                requestee: this.requestee || null,
                accessToken: credentials.auth,
                status: 'created'
              })
            },
            refused: function (code) {
              this.invitations.create({
                campaignId: this.campaign.id,
                requester: this.requester.username,
                requestee: this.requestee || null,
                accessToken: null,
                status: 'refused'
              })
            },
            error: function (code, message) {

            }
          }
        };

        pryv.Auth.config.registerURL.host = 'reg.' + pryvDomain;
        pryv.Auth.setup(settings);
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #InvitationDisplay {
        width:100%;
        height:100%;
    }
    table {
        margin: 0 auto; /* or margin: 0 auto 0 auto */
    }
</style>