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
  import Users from '@/models/users';

  import * as pryv from 'pryv';

  export default {
    name: 'InvitationDisplay',
    data () {
      return {
        invitationsModel: new Invitations({
          username: this.$route.query.username || 'empty',
          token: 'TODO'
        }),
        campaignsModel: new Campaigns({
          username: this.$route.query.username || 'empty',
          token: 'TODO'
        }),
        usersModel: new Users(),
        requester: {
          username: this.$route.query.username ||'empty'
        },
        campaign: {
          id: this.$route.query.campaignId
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
      async getCampaign() {
        const response = await this.campaignsModel.getOne({
          campaignId: this.campaign.id
        });
        console.info('retrieved', response.body);
        this.campaign = response.body.campaign;
        this.loadButton();
      },
      loadButton() {
        const pryvDomain = 'pryv.me';
        const that = this;

        const settings = {
          requestingAppId: this.campaign.pryvAppId,
          requestedPermissions: this.campaign.permissions,
          spanButtonID: 'pryv-button',
          callbacks: {
            initialization: function () {
                // unused
            },
            needSignin: function (popupUrl, pollUrl, pollRateMs) {
                // unused
            },
            async signedIn (credentials) {
              console.info('signed in', credentials);

              try {
                await that.usersModel.create({
                  pryvUsername: credentials.username
                });
              } catch (e) {
                if (e.response)
                  console.log('error creating user', e.response.body)
              }

              try {
                let response = await that.invitationsModel.create({
                  requester: {

                  },
                  campaign: {
                    id: that.campaign.id
                  },
                  requestee: {
                    username: that.requestee || null,
                    pryvUsername: credentials.username
                  },
                  accessToken: credentials.auth,
                  status: 'accepted'
                });
                console.info('creation successful', response.body);
                alert('invitation created:' + JSON.stringify(response.body));
              } catch (e) {
                if (e.response && e.response.body.error.indexOf('exists') > 0) {
                  console.log(e.response.body);
                } else {
                  alert('error creating approval' + e);
                }
              }
            },
            async refused(code) {
              console.info('refused', code);

              try {
                await that.usersModel.create({
                  pryvUsername: credentials.username
                });
              } catch (e) {
                if (e.response)
                  console.log('error creating user', e.response.body)
              }

              try {
                let response = await that.invitationsModel.create({
                  campaignId: that.campaign.id,
                  requestee: that.requestee || null,
                  requesteePryvUsername: that.requesteePryvUsername,
                  accessToken: null,
                  status: 'refused'
                });
                alert('invitation created:' + JSON.stringify(response.body));
              } catch (e) {
                if (e.response && e.response.body.error.indexOf('exists') > 0) {
                  console.log(e.response.body);
                } else {
                  console.info('error refusal', e);
                  alert('error creating refusal', e);
                }
              }
            },
            error: function (code, message) {
                alert('error during auth. code=' + code + ', message:' + message);
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