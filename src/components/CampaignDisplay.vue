<template>
    <div id="CampaignDisplay">
        <h2>Campaign</h2>
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
        </table>

        <br>

    </div>


</template>

<script>
  import Campaigns from '@/models/campaigns';

  import * as pryv from 'pryv';

  export default {
    name: 'CampaignDisplay',
    data () {
      return {
        campaignsModel: new Campaigns({
          username: this.$route.query.username || 'empty',
          token: 'TODO'
        }),
        requester: {
          username: this.$route.query.username ||'empty'
        },
        campaign: {
          id: this.$route.query.campaignId || 'empty'
        },
        columns: [
          'id',
          'title',
          'description',
          'created',
          'permissions',
          'pryvAppId',
          'invitationLink'
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
      back() {
        this.$router.replace('/account/' + this.user.username);
      },
      async getCampaign() {
        const response = await this.campaignsModel.getOne({
          campaignId: this.campaign.id
        });
        console.info('retrieved', response.body);
        this.campaign = response.body.campaign;
        const camp = response.body.campaign;
        console.info('perms', response.body.campaign.permissions)
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #CampaignDisplay {
        width:100%;
        height:100%;
    }
    table {
        margin: 0 auto; /* or margin: 0 auto 0 auto */
    }
</style>