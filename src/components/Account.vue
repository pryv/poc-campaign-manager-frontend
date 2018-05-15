<template>
    <div id="campaignsList">
        <h2>Account</h2>
        <div>
            username: {{ user.username }}
        </div>
        <h3>Campaigns</h3>
        <table>
            <thead>
            <tr>
                <th v-for="property in campaignProperties">
                    {{ property }}
                </th>
                <th>
                    Invitation
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="campaign in campaigns">
                <td v-for="key in campaignProperties">
                    {{ campaign[key] }}
                </td>
                <td>
                    <button @click="createInvitation(campaign.id, campaign.title)">Create Invitation</button>
                </td>
            </tr>
            </tbody>

        </table>
        <div>
            <button @click="openCreateCampaign">New Campaign</button>
        </div>
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';

  export default {
    name: 'Account',
    props: [
      'title',
      'description',
      'created',
      'permissions',
      'pryvAppId'
    ],
    data: function () {
      return {
        user: {
          username: this.$route.params.username || 'empty'
        },
        campaignsModel: new Campaigns({
          username: this.$route.params.username || 'bob'
        }),
        campaigns: [
          {
            id: 'dId',
            title: 'dTitle',
            description: 'dDescription',
            created: 1010101,
            permissions: [
              {
                streamId: 'dDiary',
                defaultNamE: 'dDiary',
                level: 'dLevel'
              }],
            pryvAppId: 'dPryv-App-Id'
          }
        ],
        campaignProperties: [
          'title',
          'description',
          'permissions',
          'created',
          'pryvAppId',
          'invitationLink'
        ]
      }
    },
    created() {
      this.user.username = this.$route.params.username;
      this.getCampaigns();
    },
    methods: {
      createInvitation(campaignId, campaignTitle) {
        this.$router.push({
          path: '/invitations/new',
          query: {
            username: this.user.username,
            campaignId: campaignId,
            campaignTitle: campaignTitle
          }
        });
      },
      async getCampaigns() {
        console.log('loadin campaigns for', this.$route.params);

        const response = await this.campaignsModel.get();
        console.log('got campaigns?', response.body);
        const retrievedCampaigns = response.body.campaigns;
        retrievedCampaigns.forEach((c) => {
          c.invitationLink = '/invitations/view/?campaignId=' + c.id;
          c.created = new Date(c.created * 1000).toString()
        });
        this.campaigns = retrievedCampaigns;
      },
      openCreateCampaign() {
        this.$router.push({
          path: '/campaigns/new/' + this.user.username,
          query: {
            username: this.user.username
          }
        })
      }
    }
  };

  function inspect(item) {
    require('util').inspect(item, {showHidden: false, depth: null})
  }
</script>
