<template>
<div id="account">

    <h2>Account</h2>
    <div>
        username: {{ user.username }}
    </div>
    <div v-if="user.isLinkedToPryv === false">
        <v-btn depressed small color="primary" @click="openLinkToPryv()">
            Sync accepted invitations with my Pryv account
        </v-btn>
    </div>
    <div v-else>
      Account is linked to Pryv account 
        <a
          :href="''"
          target="_blank"
        >
          {{ pryvEndpoint }}
        </a>
    </div>

    <div id="campaignsList">

        <CampaignsList :campaigns="campaigns" :user="user"></CampaignsList>

        <div>
            <v-btn depressed small color="primary" @click="openCampaignCreate">
                Create Campaign
            </v-btn>
        </div>

    </div>

    <SentInvitations :invitations="sentInvitations"></SentInvitations>

</div>
</template>

<script>
  import Campaigns from '@/models/campaigns';
  import Invitations from '@/models/invitations';
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';
  import config from '@/utils/config';

  import CampaignsList from './bits/CampaignsList';
  import SentInvitations from './bits/SentInvitations';

  import helpers from '@/utils/helpers';

  export default {
    name: 'Account',
    components: {
      CampaignsList,
      SentInvitations,
    },
    data: function () {
      return {
        user: {
          username: this.$route.query.username,
          id: this.$route.query.id,
          pryvUsername: this.$route.query.pryvUsername,
          pryvToken: this.$route.query.pryvToken,
          token: this.$route.query.token,
          isLinkedToPryv: false
        },
        pryvDomain: config.pryv.domain,
        pryvModel: new Pryv(),
        usersModel: new Users(),
        campaignsModel: new Campaigns(),
        invitationsModel: new Invitations(),
        followedSlices: [],
        campaigns: [],
        sentInvitations: [],
        receivedInvitations: []
      }
    },
    async created() {
      await this.pryvModel.fetchServiceInfo();
      await this.getUserData();
      await this.getCampaigns();
      await this.getInvitations();
      await this.isAccountLinkedToPryv();
      if (this.user.isLinkedToPryv) {
        await this.getFollowedSlices();
        await this.updateFollowedSlices();
        await this.saveCredentialsInProfile();
      }
    },
    computed: {
      pryvEndpoint() {
        return this.pryvModel.getBaseUrl(this.user.pryvUsername);
      }
    },
    methods: {
      async saveCredentialsInProfile() {
        try {
          const addCmTokenToPryvProfileResponse = await this.pryvModel.updateProfile({
            username: this.user.username,
            token: this.user.token,
            pryvUsername: this.user.pryvUsername,
            pryvToken: this.user.pryvToken,
          });
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while saving CM credentials to Pryv account', errorData);
        }
      },
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
            username: this.user.pryvUsername,
            token: this.user.pryvToken
          });
          console.info('pryv token valid', accessInfo);
          this.user.isLinkedToPryv = true;
        } catch (e) {
          if (e.response && e.status && (e.status === 401)) {
            this.user.isLinkedToPryv = false;
          } else {
            console.error('error retrieving access info', e);
          }
        }
      },
      async getFollowedSlices() {
        try {
          const slices = await this.pryvModel.getFollowedSlices({
            username: this.user.pryvUsername,
            token: this.user.pryvToken
          });
          this.followedSlices = slices;
          console.info('retrieved slices', slices);
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while fetching followed slices', errorData);
        }

      },
      async updateFollowedSlices() {
        this.sentInvitations.forEach(async (i) => {
          if ((i.status === 'accepted') && (! this.sliceExists(i))) {
            await this.createFollowedSlice(i);
          } else if ((i.status !== 'accepted') && (this.sliceExists(i))) {
            await this.deleteFollowedSlice(i);
          } else {
            // do nothing
          }
        });
      },
      async createFollowedSlice(invitation) {
        try {
          const createdSlice = await this.pryvModel.createSlice({
            username: this.user.pryvUsername,
            token: this.user.pryvToken,
            invitation: invitation
          });
          this.followedSlices.push(createdSlice);
          console.info('created slice', createdSlice);
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while creating followed slice', errorData);
        }
      },
      async deleteFollowedSlice(invitation) {
        try {
          const sliceIndex = this.findSliceIndex(invitation);
          const deletedSlice = await this.pryvModel.deleteSlice({
            username: this.user.username,
            token: this.user.pryvToken,
            slice: this.followedSlices[sliceIndex]
          });
          this.followedSlices = this.followedSlices.slice(sliceIndex, 1);
          console.info('deleted slice', deletedSlice);
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while creating followed slice', errorData);
        }
      },
      sliceExists(invitation) {
        return this.findSliceIndex(invitation) >= 0;
      },
      findSliceIndex(invitation) {
        let index = -1;
        this.followedSlices.forEach((slice, idx) => {
          if (slice.accessToken === invitation.accessToken) {
            return index = idx;
          }
        });
        return index;
      },
      async getCampaigns() {
        const response = await this.campaignsModel.get({
          username: this.user.username,
          token: this.user.token
        });
        console.log('retrieved campaigns:', response.body);
        const retrievedCampaigns = response.body.campaigns;
        retrievedCampaigns.forEach((c) => {
          c.invitationLink = buildInvitationLink(c.id);
          [c.invitationLinkMinimized] = helpers.minimizeText({
            text: c.invitationLink
          });
          c.created = helpers.printDate(c.created);
          c.permissionsDisplay = helpers.minimizePermissions(c.permissions);
          [c.descriptionDisplay, c.isDescriptionMinimized] = helpers.minimizeText({
            text: c.description,
            endChar: ' ',
          });
          c.isNotCancelled = (c.status !== 'cancelled');
        });
        this.campaigns = retrievedCampaigns;
      },
      async getInvitations() {
        try {
          const response = await this.invitationsModel.get({
            username: this.user.username,
            token: this.user.token
          });
          console.info('retrieved invitations', response.body.invitations);
          const invitations = response.body.invitations;
          this.receivedInvitations = [];
          this.sentInvitations = [];
          invitations.forEach(async (i) => {
            i.created = helpers.printDate(i.created);
            i.modified = helpers.printDate(i.modified);
            i.permissions = i.campaign.permissions;
            if (i.history != null) {
              i.history.forEach((hi) => {
                hi.modified = helpers.printDate(hi.modified);
                if (hi.accessToken == null) {
                  hi.accessToken = 'N/A';
                }
              });
            }

            this.pushInSentOrReceived({ invitation: i});

            if (i.status == 'accepted') {
              this.checkInvitationToken({ invitation: i });
            }
          });
        } catch (e) {
          console.error('error while retrieving invitations', e);
        }
      },
      pushInSentOrReceived (params) {
        console.log('checking inv for requester', params.invitation.requester.id, 'comparin with',this.user.id,
          'are they the same?', (params.invitation.requester.id === this.user.id));
        if (params.invitation.requester.id === this.user.id) {
          console.log('pushed in sent');
          params.invitation.url = buildTargetedInvitationLink(params.invitation);
          this.sentInvitations.push(params.invitation);
        } else {
          console.log('pushed in receieved');
          this.receivedInvitations.push(params.invitation);
        }
      },
      async checkInvitationToken(params) {
        console.info('verifying invitation token for user', this.user.username, 'for campaign', params.invitation.campaign.title);
        try {
          const accessInfo = await this.pryvModel.isTokenValid({
            username: params.invitation.requestee.pryvUsername,
            token: params.invitation.accessToken
          });
          console.info('valid token', accessInfo);
        } catch (e) {
          if (e.response && e.status && (e.status === 401)) {
            params.invitation.status = 'refused';
            console.info('token has been refused by the requestee');
            await this.updateInvitation(params.invitation);
          } else {
            console.error('error retrieving access info', e);
          }
        }
      },
      async updateInvitation(invitation) {
        try {
          await this.invitationsModel.refuse({
            invitationId: invitation.id,
          });
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.reponse;
          } else {
            errorData = e;
          }
          console.error('error while updating invitation status', errorData);
        }
      },
      openLinkToPryv() {
        this.$router.push({
          path: '/pryv/link',
          query: {
            username: this.user.username,
            id: this.user.id,
            token: this.user.token,
          }
        })
      },
      openCampaignCreate() {
        this.$router.push({
          path: '/campaigns/new/',
          query: {
            username: this.user.username,
            token: this.user.token,
          }
        })
      },
    }
  };

  function buildInvitationLink(id) {
    return getHostname() + '#/invitations/view/?campaignId=' + id + '&hasSignIn=true';
  }

  function buildTargetedInvitationLink(invitation) {
    return getHostname() + '#/invitations/view/?campaignId=' + invitation.campaign.id +
    '&invitationId=' + invitation.id +
    '&requestee=' + invitation.requestee.pryvUsername +
    '&hasSignIn=true';
  }

  function getHostname() {
    let baseHostname = window.location.hostname;
    let optionalPort = '';
    let optionalPath = '';

    const port = window.location.port;
    if (port != "") {
      optionalPort = ':' + port;
    }

    if (baseHostname != 'localhost') {
      optionalPath = window.location.pathname
    }
    return location.protocol + '//' + baseHostname + optionalPort + optionalPath;
  }
</script>
