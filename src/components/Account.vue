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
        <h3>Invitations</h3>
        <table>
            <thead>
                <th v-for="property in invitationsColumns">
                    {{ property }}
                </th>
            </thead>
            <tbody>
            <tr v-for="invitation in invitations">
                <td>
                    {{ invitation.campaignTitle }}
                </td>
                <td>
                    {{ invitation.requesteePryvUsername }}
                </td>
                <td>
                    {{ invitation.status }}
                </td>
                <td>
                    {{ invitation.created }}
                </td>
                <td>
                    {{ invitation.modified }}
                </td>
            </tr>
            </tbody>
        </table>
        <div>
            <button @click="openCampaignCreate">New Campaign</button>
        </div>
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';
  import Invitations from '@/models/invitations';

  export default {
    name: 'Account',
    data: function () {
      return {
        user: {
          username: this.$route.params.username || 'empty'
        },
        campaignsModel: new Campaigns({
          username: this.$route.params.username || 'bob'
        }),
        invitationsModel: new Invitations({
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
        invitations: [
          {
          }
        ],
        campaignsColumns: [
          'title',
          'description',
          'permissions',
          'created',
          'pryvAppId',
          'invitationLink'
        ],
        invitationsColumns: [
          'campaign',
          'Pryv username',
          'status',
          'created',
          'modified'
        ]
      }
    },
    created() {
      this.user.username = this.$route.params.username;
      this.getCampaigns()
        .then(this.getInvitations());
    },
    methods: {
      openInvitationCreate(campaignId, campaignTitle) {
        this.$router.push({
          path: '/invitations/new',
          query: {
            username: this.user.username,
            campaignId: campaignId,
            campaignTitle: campaignTitle
          }
        });
      },
      async getInvitations() {
        try {
          const response = await this.invitationsModel.get();
          console.info('retrieved invitations', response.body.invitations);
          const invitations = response.body.invitations;
          invitations.forEach((i) => {
            this.campaigns.forEach((c) => {
                if (i.campaignId === c.id) {
                  i.campaignTitle = c.title;
                }
            });
            i.created = printDate(i.created);
            i.modified = printDate(i.modified);
          });
          this.invitations = response.body.invitations;
        } catch (e) {
          console.error('error while retrieving invitations', e);
        }
      },
      async getCampaigns() {
        console.log('loadin campaigns for', this.$route.params);

        const response = await this.campaignsModel.get();
        console.log('retrieved campaigns:', response.body);
        const retrievedCampaigns = response.body.campaigns;
        retrievedCampaigns.forEach((c) => {
          c.invitationLink = '/invitations/view/?campaignId=' + c.id;
          c.created = printDate(c.created);
        });
        this.campaigns = retrievedCampaigns;
      },
      openCampaignCreate() {
        this.$router.push({
          path: '/campaigns/new/' + this.user.username,
          query: {
            username: this.user.username
          }
        })
      },
      openCampaignDisplay(campaignId) {
        this.$router.push({
          path: '/campaigns/view/',
          query: {
            campaignId: campaignId
          }
        });
      }
    }
  };

  function printDate(timestamp) {
    return new Date(timestamp * 1000).toString();
  }
</script>
