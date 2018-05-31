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

        <div>
            <button @click="openCampaignCreate">New Campaign</button>
        </div>

        <h3>sent Invitations</h3>
        <table>
            <thead>
                <th v-for="property in sentInvitationsColumns">
                    {{ property }}
                </th>
            </thead>
            <tbody>
            <tr v-for="invitation in sentInvitations">
                <td>
                    {{ invitation.campaign.title }}
                </td>
                <td>
                    {{ invitation.requestee.username }}
                </td>
                <td>
                    {{ invitation.requestee.pryvUsername }}
                </td>
                <td>
                    {{ invitation.status }}
                </td>
                <td>
                    {{ invitation.permissions }}
                </td>
                <td>
                    {{ invitation.accessToken }}
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


        </table>
        <h3>received Invitations</h3>
        <table>
            <thead>
            <th v-for="property in receivedInvitationsColumns">
                {{ property }}
            </th>
            </thead>
            <tbody>
            <tr v-for="invitation in receivedInvitations">
                <button @click="openInvitationDisplay(invitation)">View</button>
                <td>
                    {{ invitation.campaign.title }}
                </td>
                <td>
                    {{ invitation.requester.username }}
                </td>
                <td>
                    {{ invitation.status }}
                </td>
                <td>
                    {{ invitation.permissions }}
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
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';
  import Invitations from '@/models/invitations';
  import Users from '@/models/users';

  export default {
    name: 'Account',
    data: function () {
      return {
        user: {
          username: this.$route.query.username || 'empty',
          id: this.$route.query.id || 'empty'
        },
        usersModel: new Users(),
        campaignsModel: new Campaigns({
          username: this.$route.query.username || 'empty'
        }),
        invitationsModel: new Invitations({
          username: this.$route.query.username || 'empty'
        }),
        campaigns: [],
        sentInvitations: [],
        receivedInvitations: [],
        campaignsColumns: [
          'title',
          'description',
          'permissions',
          'created',
          'pryvAppId',
          'invitationLink'
        ],
        sentInvitationsColumns: [
          'Campaign',
          'Username',
          'Pryv username',
          'Status',
          'Permissions',
          'Access Token',
          'Created',
          'Modified'
        ],
        receivedInvitationsColumns: [
          'View',
          'Campaign',
          'Requester',
          'Status',
          'Permissions',
          'Created',
          'Modified'
        ]
      }
    },
    async created() {
      this.user.username = this.$route.query.username;
      this.user.id = this.$route.query.id;
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
          this.receivedInvitations = [];
          this.sentInvitations = [];
          invitations.forEach((i) => {
            i.created = printDate(i.created);
            i.modified = printDate(i.modified);
            i.permissions = i.campaign.permissions;
            console.log('checking inv for requester', i.requester.id, 'comparin with',this.user.id)
            if (i.requester.id === this.user.id) {
              console.log('pushed in sent');
              this.sentInvitations.push(i);
            } else {
              console.log('pushed in receieved');
              this.receivedInvitations.push(i);
            }
          });
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
          c.invitationLink = '/invitations/view/?campaignId=' + c.id +
            '&requester=' + this.user.username;
          c.created = printDate(c.created);
        });
        this.campaigns = retrievedCampaigns;
      },
      openCampaignCreate() {
        this.$router.push({
          path: '/campaigns/new/',
          query: {
            username: this.user.username
          }
        })
      },
      openCampaignDisplay(campaignId) {
        this.$router.push({
          path: '/campaigns/view/',
          query: {
            campaignId: campaignId,
            username: this.user.username
          }
        });
      },
      openInvitationDisplay(invitation) {
        this.$router.push({
          path: '/invitations/view',
          query: {
            campaignId: invitation.campaign.id,
            invitationId: invitation.id,
            requester: invitation.requester.username,
            requestee: this.user.username
          }
        });
      }
    }
  };

  function printDate(timestamp) {
    return new Date(timestamp * 1000).toString();
  }
</script>
