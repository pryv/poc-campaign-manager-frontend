<template>
    <div id="InvitationCreate">
        <h2>Create Invitation</h2>
        <br>
        User to invite to campaign {{ campaign.title }}:<br>

        <v-form v-model="valid">
            <v-text-field
              v-model="requestee.pryvUsername"
              :rules="usernameRules"
              label="Username"
              required
            ></v-text-field>
        </v-form>

        <div v-if="invitationCreated">
            Invitation Link: {{ invitationLink }}
            <v-btn depressed small color="primary" @click="copyToClipboard(invitationLink)">
                Copy link
            </v-btn>
        </div>

        <br>
        <BackButton></BackButton>
        <v-btn depressed small color="primary" @click="create">
            Create
        </v-btn>
    </div>
</template>

<script>
  import Invitations from '@/models/invitations';
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';
  import config from '@/models/config';

  import BackButton from './bits/BackButton';

  export default {
    name: 'InvitationCreate',
    components: {
      BackButton
    },
    data () {
      return {
        usersModel: new Users(),
        invitationsModel: new Invitations(),
        pryvModel: new Pryv(),
        requester: {
          username: this.$route.query.username,
        },
        campaign: {
          id: '',
          title: ''
        },
        requestee: {
          pryvUsername: ''
        },
        backButtonText: 'Cancel',
        valid: false,
        usernameRules: [
            v => !!v || 'Username is required'
        ],
        latestInvitation: null
      }
    },
    created() {
      this.requester.username = this.$route.query.username;
      this.campaign.id = this.$route.query.campaignId;
      this.campaign.title = this.$route.query.campaignTitle;
    },
    methods: {
      async create() {
        try {
          const usersExists = await this.pryvModel.userExists({username: this.requestee.pryvUsername});
          if (! usersExists) {
            alert('Pryv user ' + this.requestee.pryvUsername + ' does not exist. Please enter a valid username.');
            return;
          }

          try {
            await this.usersModel.create({
              pryvUsername: this.requestee.pryvUsername
            });
          } catch (e) {
            if (e.response)
              console.log('error creating user', e.response.body)
          }
          const response = await this.invitationsModel.create({
            requestee: {
              pryvUsername: this.requestee.pryvUsername
            },
            campaign: {
              id: this.campaign.id
            }
          });
          const invitation = response.body.invitation;
          console.info('created invitation', invitation);
          alert('invitation created: ' + JSON.stringify(invitation));
          this.latestInvitation = invitation;
          this.clearUsername();
        } catch (e) {
          let msg = e;
          if (e.response) {
            msg = e.response.body;
          }
          alert('error while creating invitation' + JSON.stringify(msg));
          console.error('error while creating invitation', msg);
        }

      },
      copyToClipboard(url) {
        this.$copyText(url).then(function (e) {
          console.log(e)
        }, function (e) {
          alert('Can not copy');
          console.log(e)
        })
      },
      clearUsername() {
        this.requestee.pryvUsername = '';
      }
    },
    computed: {
      invitationLink() {
        if (this.latestInvitation == null) {
          return null;
        }

        return config.hostname + '/invitations/view/?campaignId=' + this.latestInvitation.campaign.id +
          '&invitationId=' + this.latestInvitation.id +
          '&requestee=' + this.latestInvitation.requestee.pryvUsername;
      },
      invitationCreated() {
        return (this.latestInvitation != null);
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #InvitationCreate {
    }
</style>