<template>
<div id="account">
    <h2>Account</h2>
    <div>
        username: {{ user.username }}
        <div> {{ isLinkedToPryv }}</div>
    </div>
    <div>
        <button @click="openLinkToPryv()">Link to my Pryv</button>
    </div>

    <div id="campaignsList">
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
  import Pryv from '@/models/pryv';

  export default {
    name: 'Account',
    data: function () {
      return {
        user: {
          username: this.$route.query.username || 'empty',
          id: this.$route.query.id || 'empty',
          pryvUsername: this.$route.query.pryvUsername || null,
          pryvToken: this.$route.query.pryvToken || null,
          token: this.$route.query.token || null,
          isLinkedToPryv: false
        },
        pryvModel: new Pryv(),
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
      await this.getUserData();
      await this.isAccountLinkedToPryv();
      await this.getCampaigns();
      await this.getInvitations();
    },
    computed: {
      isLinkedToPryv() {
        if (this.user.isLinkedToPryv) {
          return 'Account is linked to Pryv.';
        } else {
          return null;
        }
      }
    },
    methods: {
      async getUserData() {
        try {
          const userResponse = await this.usersModel.getOne({
            username: this.user.username,
            token: this.user.token
          });
          console.info('retrieved user data', userResponse.body);
          const user = userResponse.body.user;
          this.user.id = user.id;
          this.user.pryvUsername = user.pryvUsername;
          this.user.pryvToken = user.pryvToken;
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while fetching account data', errorData);
        }
      },
      async isAccountLinkedToPryv() {
        if (! this.user.pryvToken) {
          return false;
        }

        try {
          const accessInfo = await this.pryvModel.isTokenValid({
            username: this.user.username,
            token: this.user.pryvToken
          });
          console.info('accessInfo retrieved', accessInfo);
          this.user.isLinkedToPryv = true;
        } catch (e) {
          if (e.response && e.status && (e.status === 401)) {
            this.user.isLinkedToPryv = false;
          } else {
            console.error('error retrieving access info', e);
          }
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
      async getInvitations() {
        try {
          const response = await this.invitationsModel.get();
          console.info('retrieved invitations', response.body.invitations);
          const invitations = response.body.invitations;
          this.receivedInvitations = [];
          this.sentInvitations = [];
          invitations.forEach(async (i) => {
            i.created = printDate(i.created);
            i.modified = printDate(i.modified);
            i.permissions = i.campaign.permissions;

            this.pushInSentOrReceived({ invitation: i});

            if (i.status == 'accepted') {
              this.checkInvitationToken({ invitation: i });
            }
          });
        } catch (e) {
          console.error('error while retrieving invitations', e);
        }
      },
      pushInSentOrReceived (params: {
        invitation: Object
      }): void {
        console.log('checking inv for requester', params.invitation.requester.id, 'comparin with',this.user.id,
          'are they the same?', (params.invitation.requester.id === this.user.id));
        if (params.invitation.requester.id === this.user.id) {
          console.log('pushed in sent');
          this.sentInvitations.push(params.invitation);
        } else {
          console.log('pushed in receieved');
          this.receivedInvitations.push(params.invitation);
        }
      },
      async checkInvitationToken(params: {
        invitation: Object
      }): void {
        console.info('verifying invitation token for user', this.user.username, 'for campaign', params.invitation.campaign.title);
        try {
          const accessInfo = await this.pryvModel.isTokenValid({
            username: params.invitation.requestee.pryvUsername,
            token: params.invitation.accessToken
          });
          console.info('accessInfo retrieved', accessInfo);
        } catch (e) {
          if (e.response && e.status && (e.status === 401)) {
            params.invitation.status = 'hold';

          } else {
            console.error('error retrieving access info', e);
          }
        }
      },
      openLinkToPryv() {
        this.$router.push({
          path: '/pryv/link',
          query: {
            username: this.user.username,
            id: this.user.id
          }
        })
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
