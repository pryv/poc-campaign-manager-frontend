<template>
    <div class="SentInvitations">
        <h3>Invitations</h3>

        <v-card-title>
          <v-btn depressed small color="primary" @click="copyTableauLinkToClipboard()">
            Export to Tableau
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="sentInvitationsColumns"
          :items="invitations"
          :search="search"
          hide-actions
          class="elevation-0"
        >
            <template slot="items" slot-scope="props">
                <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.campaign.title }}</td>
                    <td>{{ props.item.requestee.pryvUsername }}</td>
                    <td>{{ props.item.status }}</td>
                    <td>
                      <div v-if="props.item.status === 'refused'">
                        {{ props.item.accessToken }}
                      </div>
                      <div v-else>
                        <a
                          :href="'https://' + props.item.requestee.pryvUsername + '.pryv.me/#/sharings/' + props.item.accessToken"
                          target="_blank"
                        >
                          {{ props.item.accessToken }} TODO
                        </a>
                      </div>
                    </td>
                    <td style="white-space:nowrap;">
                      <v-tooltip top>
                        <v-btn 
                          slot="activator" 
                          icon
                          @click="copyToClipboard(props.item.url)"
                        >
                          <v-icon color="grey lighten-1">file_copy</v-icon>
                        </v-btn>
                        <span>Click to copy to clipboard</span>
                      </v-tooltip>
                      <v-tooltip top>
                        <v-btn 
                          slot="activator" 
                          icon
                          @click="openInvitationLink(props.item.url)"
                        >
                          <v-icon color="grey lighten-1">open_in_new</v-icon>
                        </v-btn>
                        <span>Click to open in new tab</span>
                      </v-tooltip>
                    </td>
                    <td>{{ props.item.created }}</td>
                    <td>{{ props.item.modified }}</td>
                </tr>
            </template>
            <template slot="expand" slot-scope="props">
              <v-data-table
                :headers="historyColumns"
                :items="props.item.history"
                hide-actions
                class="elevation-0"
              >
                <template slot="items" slot-scope="subProps">
                  <td>{{ subProps.item.status }}</td>
                  <td>{{ subProps.item.accessToken }}</td>
                  <td>{{ subProps.item.modified }}</td>
                </template>
              </v-data-table>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Your search for "{{ search }}" found no results.
            </v-alert>
        </v-data-table>

    </div>
</template>

<script>
  import config from '@/utils/config';

  export default {
    name: 'SentInvitations',
    props: [
      'invitations'
    ],
    methods: {
      copyToClipboard(url) {
        this.$copyText(url).then(function (e) {
          console.log(e)
        }, function (e) {
          alert('Can not copy')
          console.log(e)
        })
      },
      openInvitationLink(link) {
        window.open(link);
      },
      copyTableauLinkToClipboard() {
        let URL = 'pryvcampaign://' + config.hostname + '/invitations?auth=' + this.$route.query.token + '&username=' + this.$route.query.username;
        const campaignId = this.$route.query.campaignId;
        if (campaignId != null) {
          URL += '&campaignId=' + campaignId;
        }
        this.$copyText(URL).then(function (e) {
          console.log(e)
        }, function (e) {
          alert('Can not copy')
          console.log(e)
        })
      },
    },
    data: function () {
      return {
        pryvDomain: config.pryv.domain,
        search: '',
        sentInvitationsColumns: [
          {
            text: 'Campaign',
            value: 'campaign.title',
            align: 'center',
          },
          {
            text: 'Pryv Username',
            value: 'requestee.pryvUsername',
            align: 'center',
          },
          {
            text: 'Status',
            value: 'status',
            align: 'center',
          },
          {
            text: 'Access Token',
            value: 'accessToken',
            align: 'center',
            sortable: false
          },
          {
            text: 'Invitation Link',
            value: 'link',
            align: 'center',
            sortable: false
          },
          {
            text: 'Created',
            value: 'created',
            align: 'center',
          },
          {
            text: 'Modified',
            value: 'modified',
            align: 'center',
          }
        ],
        historyColumns: [
          {
            text: 'Status',
            value: 'status',
            align: 'center',
            sortable: false
          },
          {
            text: 'AccessToken',
            value: 'accessToken',
            align: 'center',
            sortable: false
          },
          {
            text: 'Date',
            value: 'modified',
            align: 'center',
            sortable: false
          }
        ]
      }
    }
  }
</script>

