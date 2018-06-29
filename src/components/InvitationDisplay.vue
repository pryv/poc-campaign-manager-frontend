<template>
    <div id="InvitationDisplay">
        <h2>Campaign Invitation</h2>
        <Campaign :campaign="campaign"></Campaign>

        <br>
        <button v-on:click="back">Back</button>
        <br><br>

        <div v-if="hasCancelButton">
            <button v-on:click="revoke">Revoke</button>
        </div>
        <div v-else>
            By signing here, you consent to participate to the campaign.
            <br>
            <span id="pryv-button"></span><br>
        </div>
    </div>


</template>

<script>
  import Invitations from '@/models/invitations';
  import Campaigns from '@/models/campaigns';
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';

  import Campaign from './bits/Campaign';

  import * as pryv from 'pryv';
  import _ from 'lodash';

  export default {
    name: 'InvitationDisplay',
    components: {
      Campaign
    },
    data () {
      return {
        requester: {
          username: this.$route.query.requester || null,
        },
        requestee: {
          username: this.$route.query.requestee || null,
          pryvToken: this.$route.query.pryvToken || null,
        },
        campaign: {
          id: this.$route.query.campaignId,
        },
        invitation: {
          id: this.$route.query.invitationId || null,
          accessId: this.$route.query.accessId || null,
        },
        isTargeted: this.$route.query.invitationId ? true : false,
        hasCancelButton: this.$route.query.hasCancel || false,
        invitationsModel: new Invitations({
          username: this.$route.query.requester || null,
          token: 'TODO',
        }),
        campaignsModel: new Campaigns({
          username: this.$route.query.requester || null,
          token: 'TODO'
        }),
        usersModel: new Users(),
        pryvModel: new Pryv(),
      }
    },
    computed: {
      createdReadable() {
        return new Date(this.campaign.created * 1000).toString();
      }
    },
    async created() {
      await this.getCampaign();
      if (! this.hasCancelButton) {
        this.loadButton();
      }
    },
    methods: {
      async getCampaign() {
        const response = await this.campaignsModel.getOne({
          campaignId: this.campaign.id
        });
        console.info('retrieved', response.body);
        this.campaign = _.extend(response.body.campaign, {requester: this.requester });
      },
      loadButton() {
        const pryvDomain = 'pryv.me';
        const settings = loadSettings(this);

        pryv.Auth.config.registerURL.host = 'reg.' + pryvDomain;
        pryv.Auth.setup(settings);
      },
      back() {
        this.$router.back();
      },
      async revoke() {
        try {
          await this.pryvModel.deleteAccess({
            username: this.requestee.username,
            token: this.requestee.pryvToken,
            accessId: this.invitation.accessId,
          });
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while revoking access', errorData);
        }
      }
    }
  };

  function loadSettings(that) {
    return {
      disableCookies: true,
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

          if (credentials.username !== that.requestee.username) {
            console.error('requestee username ' + that.requestee.username + ' and authentified user ' + credentials.username +
                ' do not match. Invitation update dropped.');
            return alert('Access have been approved by ' + credentials.username + ', but the invitation was intended for ' +
              that.requestee.username + '. No access has been stored in the Campaign Manager.');
          }

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
              console.info('update successful', response.body);
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
          console.info('invitation refused, callback code:', code);

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