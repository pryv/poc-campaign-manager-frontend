<template>
    <div id="InvitationCreate">
        <h2>Create Invitation</h2>
        <br>
        User to invite to campaign {{ campaign.title }}:<br>
        <input v-model="requestee.pryvUsername" placeholder="enter Pryv username">
        <br>
        <BackButton></BackButton><button @click="create">Create</button>
    </div>
</template>

<script>
  import Invitations from '@/models/invitations';
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';

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
        }
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
            alert('Pryv user does not exist. Please enter a valid username.');
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
          console.info('created invitation', response.body);
          alert('invitation created: ' + JSON.stringify(response.body));
        } catch (e) {
          let msg = e;
          if (e.response) {
            msg = e.response.body;
          }
          alert('error while creating invitation' + JSON.stringify(msg));
          console.error('error while creating invitation', msg);
        }

      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #InvitationCreate {
    }
</style>