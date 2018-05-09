<template>
    <div id="DisplayInvitation">
        <h2>Invitation to campaign</h2>
        <br>
        Title: {{ campaign.title }}<br>
        Description: {{ campaign.description }}<br>
        Permissions: {{ campaign.permissions }}<br>
        Pryv App Id: {{ campaign.pryvAppId }}<br>
        Created: {{ createdReadable }}<br>
        Requester: {{ requester.username }}<br>

        <button>Pryv Sign in button</button>
    </div>
</template>

<script>
  import Invitations from '@/models/invitations';

  export default {
    name: 'DisplayInvitation',
    data () {
      return {
        invitationsModel: new Invitations({
          username: this.$route.query.username || 'bob',
          token: 'TODO'
        }),
        requester: {
          username: 'empty'
        },
        campaign: {
          id: 'c1n3ok12o3kn12ok3',
          title: 'Blood Pressure',
          description: 'The goal of this campaign is to review the blood pressure of patients aged 18-52 to improve their well-being.' +
          '\n\n' +
          'Study made by John Hopkins University',
          created: (Date.now() / 1000),
          permissions: 'permissions array'
        }
      }
    },
    computed: {
      createdReadable() {
        return new Date(this.created * 1000).toString();
      }
    },
    created() {
      this.requester.username = this.$route.query.requester;
      this.campaign.id = this.$route.query.campaignId;
    },
    methods: {
      back() {
        this.$router.replace('/account/' + this.user.username);
      },
      async create() {

      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #DisplayInvitation {
    }
</style>