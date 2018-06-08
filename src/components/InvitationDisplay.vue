<template>
    <div id="InvitationDisplay">
        <h2>Campaign Invitation</h2>
        <table>
            <tr>
                <td>Requester:</td>
                <td>{{ requester.username }}</td>
            </tr>
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
        </table>

        <br>
        <button v-on:click="back">Back</button>
        <br><br>

        By signing here, you consent to participate to the campaign.

        <br>

        <span id="pryv-button"></span><br>


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
        requester: {
          username: this.$route.query.requester || null,
        },
        requestee: {
          username: this.$route.query.requestee || null,
        },
        campaign: {
          id: this.$route.query.campaignId,
        },
        invitation: {
          id: this.$route.query.invitationId || null
        },
        isTargeted: this.$route.query.invitationId ? true : false,
        invitationsModel: new Invitations({
          username: this.$route.query.requester || null,
          token: 'TODO'
        }),
        campaignsModel: new Campaigns({
          username: this.$route.query.requester || null,
          token: 'TODO'
        }),
        usersModel: new Users(),
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
    async created() {
      await this.getCampaign();
      this.loadButton();
    },
    methods: {
      async getCampaign() {
        const response = await this.campaignsModel.getOne({
          campaignId: this.campaign.id
        });
        console.info('retrieved', response.body);
        this.campaign = response.body.campaign;
      },
      loadButton() {
        const pryvDomain = 'pryv.me';
        const settings = loadSettings(this);

        pryv.Auth.config.registerURL.host = 'reg.' + pryvDomain;
        pryv.Auth.setup(settings);
      },
      back() {
        this.$router.back();
      }
    }
  };

  function loadSettings(that) {
    return {
      requestingAppId: that.campaign.pryvAppId,
      requestedPermissions: that.campaign.permissions,
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

          if (that.isTargeted) {
            try {
              await that.usersModel.update({
                username: that.requestee.username,
                pryvUsername: credentials.username
              });
            } catch (e) {
              if (e.response)
                console.log('error updating user', e.response.body)
            }
          }

          try {

            if (that.isTargeted && (that.invitation.status !== 'accepted')) {
              let response = await that.invitationsModel.update({
                invitation: {
                  id: that.invitation.id,
                  status: 'accepted',
                  accessToken: credentials.auth,
                }
              });
              console.info('update succesful', response.body);
              alert('invitation updated:' + JSON.stringify(response.body));
            } else {
              let response = await that.invitationsModel.create({
                requester: that.requester,
                campaign: that.campaign,
                requestee: {
                  username: that.requestee.username,
                  pryvUsername: credentials.username
                },
                accessToken: credentials.auth,
                status: 'accepted'
              });
              console.info('creation successful', response.body);
              alert('invitation created:' + JSON.stringify(response.body));
            }
          } catch (e) {
            if (e.response && e.response.body.error.indexOf('exists') > 0) {
              console.log(e.response.body);
            } else {
              alert('error creating approval' + e);
            }
          }
        },
        async refused(code) {
          return console.info('refused', code);

          if (that.isTargeted) {
            try {
              let response = await that.invitationsModel.update({
                invitation: {
                  id: that.invitation.id,
                  status: 'refused'
                }
              });
              alert('invitation updated:' + JSON.stringify(response.body));
            } catch (e) {
              if (e.response && e.response.body.error.indexOf('exists') > 0) {
                console.log(e.response.body);
              } else {
                console.info('error refusal', e);
                alert('error creating refusal', e);
              }
            }
          } else {
            console.info('untargeted invitation refused. Nothing to see here.');
          }
        },
        error: function (code, message) {
          alert('error during auth. code=' + code + ', message:' + message);
        }
      }
    };
  }
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