<template>
    <div id="InvitationCreate">
        <h2>Create Invitation</h2>
        <br>
        User to invite to campaign {{ campaign.title }}:<br>
        <input v-model="requestee.usernameDomain" placeholder="enter username">
        <br>
        <button v-on:click="back">Back</button><button v-on:click="create">Create</button>
    </div>
</template>

<script>
  import Invitations from '@/models/invitations';

  export default {
    name: 'InvitationCreate',
    data () {
      return {
        invitationsModel: new Invitations({
          username: this.$route.query.username || 'bob',
          token: 'TODO'
        }),
        user: {
          username: 'empty'
        },
        campaign: {
          id: '',
          title: ''
        },
        requestee: {
          usernameDomain: 'testuser.pryv.li'
        }
      }
    },
    created() {
      this.user.username = this.$route.query.username;
      this.campaign.id = this.$route.query.campaignId;
      this.campaign.title = this.$route.query.campaignTitle;
    },
    methods: {
      back() {
        this.$router.back();
      },
      async create() {

      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #InvitationCreate {
    }
</style>