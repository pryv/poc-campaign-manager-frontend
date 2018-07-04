<template>
  <div class="CampaignsList">

    <h3>Campaigns</h3>
    <table>
      <thead>
      <tr>
        <th>
          View
        </th>
        <th v-for="property in campaignsColumns">
          {{ property }}
        </th>
        <th>
          Invitation
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="campaign in campaigns">
        <button @click="openCampaignDisplay(campaign.id)">View</button>
        <td>
          {{ campaign.title }}
        </td>
        <td>
          {{ campaign.description }}
        </td>
        <td>
          {{ campaign.permissions }}
        </td>
        <td>
          {{ campaign.created }}
        </td>
        <td>
          {{ campaign.pryvAppId }}
        </td>
        <td>
          <a :href="'' + campaign.invitationLink">
            {{ campaign.invitationLink }}
          </a>
        </td>
        <td>
          <button @click="openInvitationCreate(campaign.id, campaign.title)">Create Invitation</button>
        </td>
      </tr>
      </tbody>
    </table>
    

  </div>
</template>

<script>
  export default {
    name: 'CampaignsList',
    props: [
      'campaigns',
      'user'
    ],
    data: function () {
      return {
        campaignsColumns: [
          'title',
          'description',
          'permissions',
          'created',
          'pryvAppId',
          'invitationLink'
        ]
      }
    },
    computed: {
      createdReadable() {
        return new Date(this.campaign.created * 1000).toString();
      },
      hasRequester() {
        return (this.campaign.requester != null);
      }
    },
    methods: {
      openCampaignDisplay(campaignId) {
        this.$router.push({
          path: '/campaigns/view/',
          query: {
            campaignId: campaignId,
            username: this.user.username
          }
        });
      },
      openInvitationCreate(campaignId, campaignTitle) {
        this.$router.push({
          path: '/invitations/new',
          query: {
            username: this.user.username,
            campaignId: campaignId,
            campaignTitle: campaignTitle,
            token: this.user.token,
          }
        });
      }
    }
  }
</script>

