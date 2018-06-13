<template>
    <div id="InvitationCreate">
        <h2>Create Invitation</h2>
        <br>
        User to invite to campaign {{ campaign.title }}:<br>
        <input v-model="requestee.username" placeholder="enter CM username">
        <br>
        <button v-on:click="back">Back</button><button v-on:click="create">Create</button>
    </div>
</template>

<script>
  import Invitations from '@/models/invitations';
  import Pryv from '@/models/pryv';

  export default {
    name: 'InvitationCreate',
    data () {
      return {
        invitationsModel: new Invitations({
          username: this.$route.query.username || null,
          token: 'TODO'
        }),
        pryvModel: new Pryv(),
        requester: {
          username: this.$route.query.username || 'empty'
        },
        campaign: {
          id: '',
          title: ''
        },
        requestee: {
          username: ''
        }
      }
    },
    created() {
      this.requester.username = this.$route.query.username;
      this.campaign.id = this.$route.query.campaignId;
      this.campaign.title = this.$route.query.campaignTitle;
    },
    methods: {
      back() {
        this.$router.back();
      },
      async create() {
        try {
          const usersExists = await this.pryvModel.userExists({username: this.requestee.username});
          if (! usersExists) {
            alert('user does not exist. Please enter a valid username.');
            return;
          }
          const response = await this.invitationsModel.create({
            requestee: {
              username: this.requestee.username
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