<template>
    <div id="InvitationDisplay">
        <h2>Campaign Invitation</h2>
        <Campaign :campaign="campaign"></Campaign>

        <br>

        <div v-if="hasCancelButton">
          <v-btn
              depressed 
              small 
              color="primary" 
              @click.stop="dialog = true"
            >
              Revoke access
          </v-btn>
          <v-dialog
            v-model="dialog"
            width="500"
          >
            <v-card>
              <v-card-title class="headline">Revoke Access?</v-card-title>

              <v-card-text>
                By clicking on "OK", you will prevent {{ requester.username }} from accessing your data.
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="dialog = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="revoke"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div v-if="hasSignInButton">
            {{ signInMessage }}
            <br><br>
            <span id="pryv-button"></span><br>
            <br>

        </div>
        <div v-else>
          <BackButton></BackButton>
        </div>

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
  import Invitations from '@/models/invitations';
  import Campaigns from '@/models/campaigns';
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';

  import Campaign from './bits/Campaign';
  import BackButton from './bits/BackButton';

  import * as pryv from 'pryv';
  import _ from 'lodash';

  const BASE_MESSAGE = 'To accept the invitation to this campaign, press the sign in button and follow the steps.';
  const ACCEPTED_MESSAGE = 'You have accepted the campaign invitation.';
  const REFUSED_MESSAGE = 'You have refused the campaign invitation.';
  const WRONG_USER_MESSAGE = 'This invitation was intended for someone else, no invitation was saved.'

  export default {
    name: 'InvitationDisplay',
    components: {
      Campaign,
      BackButton
    },
    data () {
      return {
        requester: {
          username: this.$route.query.requester || null,
        },
        requestee: {
          username: this.$route.query.requestee,
          pryvToken: this.$route.query.pryvToken,
        },
        campaign: {
          id: this.$route.query.campaignId,
        },
        invitation: {
          id: this.$route.query.invitationId,
          accessId: this.$route.query.accessId,
        },
        isTargeted: this.$route.query.invitationId ? true : false,
        hasCancelButton: this.$route.query.hasCancel || false,
        hasSignInButton: this.$route.query.hasSignIn || false,
        invitationsModel: new Invitations(),
        campaignsModel: new Campaigns(),
        usersModel: new Users(),
        pryvModel: new Pryv(),
        signInMessage: BASE_MESSAGE,
        snackbar: {
          display: false,
          color: 'info',
          text: ''
        },
        dialog: false,
      }
    },
    computed: {
      createdReadable() {
        return new Date(this.campaign.created * 1000).toString();
      }
    },
    async created() {
      if (this.campaign.id == null) {
        return;
      }
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
        console.info('retrieved campaign', response.body);
        this.campaign = response.body.campaign;
      },
      loadButton() {
        const pryvDomain = 'pryv.me';
        const settings = loadSettings(this);

        pryv.Auth.config.registerURL.host = 'reg.' + pryvDomain;
        pryv.Auth.setup(settings);
      },
      async revoke() {
        this.dialog = false;
        try {
          await this.pryvModel.deleteAccess({
            username: this.requestee.username,
            token: this.requestee.pryvToken,
            accessId: this.invitation.accessId,
          });
          this.hasCancelButton = false;
          this.showSnackbar({
            color: 'success',
            text: 'Access revoked.'
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
      },
      showSnackbar(params) {
        this.snackbar.text = params.text;
        this.snackbar.color = params.color;
        this.snackbar.display = true;
      }
    }
  };

  function loadSettings(that) {
    const clientDataContent = '**Requester** : ' + that.campaign.requester + '<br/>' +
      '**Title** : ' + that.campaign.title + '<br/>' +
      '**Description** : <br/>' + that.campaign.description;
    const clientData = {'app-web-auth:description': {'type': 'note/txt','content': clientDataContent}};
    return {
      disableCookies: true,
      requestingAppId: that.campaign.pryvAppId,
      requestedPermissions: that.campaign.permissions,
      clientData: clientData,
      spanButtonID: 'pryv-button',
      cookiesForceDisable: true,
      callbacks: {
        initialization: function () {
          that.signInMessage = BASE_MESSAGE;
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
            if (that.isTargeted) {
              if (credentials.username !== that.requestee.username) {
                console.error('requestee username ' + that.requestee.username + ' and authentified user ' + credentials.username +
                  ' do not match. Invitation update dropped.');
                that.signInMessage = WRONG_USER_MESSAGE;
                return that.showSnackbar({
                  color: 'error',
                  text: 'Access have been approved by ' + credentials.username + ', but the invitation was intended for ' +
                  that.requestee.username + '. No access has been stored.'
                });
              }
              let response = await that.invitationsModel.accept({
                invitationId: that.invitation.id,
                pryvAccessToken: credentials.auth
              });
              console.info('update successful', response.body);
              that.showSnackbar({
                color: 'success',
                text: 'Invitation updated.'
              });
            } else {
              let response = await that.invitationsModel.create({
                campaign: that.campaign,
                requestee: {
                  username: that.requestee.username,
                  pryvUsername: credentials.username
                },
                accessToken: credentials.auth,
                status: 'accepted'
              });
              console.info('creation successful', response.body);
              'invitation updated:' + JSON.stringify(response.body)
              that.showSnackbar({
                color: 'success',
                text: 'Invitation created.'
              });
            }
            that.signInMessage = ACCEPTED_MESSAGE;
          } catch (e) {
            if (e.response && e.response.body.error.indexOf('exists') > 0) {
              try {
                const invitationId = e.response.body.invitationId;
                const response = await that.invitationsModel.accept({
                  invitationId: invitationId,
                  pryvAccessToken: credentials.auth,
                });
                console.info('update successful', response.body);
                that.showSnackbar({
                  color: 'success',
                  text: 'Invitation updated.'
                });
              } catch (e) {
                that.showSnackbar({
                color: 'error',
                text: 'Error creating approval: ' + e
              });
              }
            } else {
              that.showSnackbar({
                color: 'error',
                text: 'Error creating approval: ' + e
              });
            }
          }
        },
        async refused(code) {
          console.info('invitation refused, callback code:', code);

          that.signInMessage = REFUSED_MESSAGE;
          if (that.isTargeted) {
            try {
              let response = await that.invitationsModel.refuse({
                invitationId: that.invitation.id,
              });
              that.showSnackbar({
                color: 'success',
                text: 'Invitation updated.'
              });
            } catch (e) {
              if (e.response && e.response.body.error.indexOf('exists') > 0) {
                console.log(e.response.body);
              } else {
                console.info('error refusal', e);
                that.showSnackbar({
                  color: 'error',
                  text: 'Error creating refusal: ' + e
                });
              }
            }
          } else {
            console.info('untargeted invitation refused. Nothing to see here.');
          }
        },
        error: function (code, message) {
          that.showSnackbar({
            color: 'error',
            text: 'Error during auth. code=' + code + ', message:' + message
          });
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