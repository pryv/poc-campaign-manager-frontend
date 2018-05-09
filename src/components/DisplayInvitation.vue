<template>
    <div id="DisplayInvitation">
        <h2>Invitation to campaign</h2>
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
          username: 'blop'
        },
        campaign: {
          id: 'c1n3ok12o3kn12ok3',
          title: 'Blood Pressure',
          description: 'The goal of this campaign is to review the blood pressure of patients aged 18-52 to improve their well-being.' +
          '\n\n' +
          'Study made by John Hopkins University',
          created: (Date.now() / 1000),
          permissions: 'permissions array',
          pryvAppId: 'riva-blood-pressure'
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
        return new Date(this.created * 1000).toString();
      }
    },
    created() {
      this.requester.username = 'waleed';//this.$route.query.requester;
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