<template>
  <div class="CampaignsList">

    <h3>Campaigns</h3>

    <v-data-table
      :headers="campaignsColumns"
      :items="campaigns"
      hide-actions
      class="elevation-0"
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <v-btn depressed small color="primary" @click="openCampaignDisplay(props.item.id)">
              View
            </v-btn>
          </td>
          <td>{{ props.item.title }}</td>
          <td>
            {{ props.item.descriptionDisplay }}
          </td>
          <td>{{ props.item.permissionsDisplay }}</td>
          <td>{{ props.item.created }}</td>
          <td>{{ props.item.pryvAppId }}</td>
          <td>
            <v-tooltip top>
              <v-btn 
                slot="activator" 
                icon
                @click="copyToClipboard(props.item.invitationLink)"
              >
                <v-icon color="grey lighten-1">file_copy</v-icon>
              </v-btn>
              <span>Click to copy to clipboard</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn 
                slot="activator" 
                icon
                @click="openInvitationLink(props.item.invitationLink)"
              >
                <v-icon color="grey lighten-1">open_in_new</v-icon>
              </v-btn>
              <span>Click to open in new tab</span>
            </v-tooltip>
          </td>
          <td v-if="props.item.isNotCancelled">
            <v-btn depressed small color="primary" @click="openInvitationCreate(props.item.id, props.item.title)">
              Create Invitation
            </v-btn>
          </td>
          <td v-else>
            Campaign cancelled
          </td>
        </tr>
      </template>
    </v-data-table>

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
          {
            text: 'View',
            value: 'view',
            align: 'center',
            sortable: false
          },
          {
            text: 'Title',
            value: 'title',
            align: 'center',
            sortable: false
          },
          {
            text: 'Description',
            value: 'description',
            align: 'center',
            sortable: false
          },
          {
            text: 'Permissions',
            value: 'permissions',
            align: 'center',
            sortable: false
          },
          {
            text: 'Created',
            value: 'created',
            align: 'center',
            sortable: false
          },
          {
            text: 'Pryv AppId',
            value: 'pryvAppId',
            align: 'center',
            sortable: false
          },
          {
            text: 'Invitation Link',
            value: 'invitationLink',
            align: 'center',
            sortable: false
          },
          {
            text: 'Invitation',
            value: 'invitation',
            align: 'center',
            sortable: false
          }
        ],
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
      copyToClipboard(url) {
        this.$copyText(url).then(function (e) {
          console.log(e)
        }, function (e) {
          alert('Can not copy')
          console.log(e)
        })
      },
      openCampaignDisplay(campaignId) {
        this.$router.push({
          path: '/campaigns/view/',
          query: {
            campaignId: campaignId,
            token: this.user.token,
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
      },
      openInvitationLink(link) {
        window.open(link);
      },
    }
  }
</script>

