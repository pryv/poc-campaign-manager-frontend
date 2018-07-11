<template>
    <div id="account">
        <h2>Account</h2>
        <div>
            username: {{ user.pryvUsername }}
        </div>

        <h3>Accesses</h3>

        <v-data-table
          :headers="cmAccessesColumns"
          :items="cmAccesses"
          hide-actions
          class="elevation-0"
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>
                        <v-btn depressed small color="primary" @click="openAccess(props.item)">
                            View
                        </v-btn>
                    </td>
                    <td>{{ props.item.campaignTitle }}</td>
                    <td>{{ props.item.campaignDescription }}</td>
                    <td>{{ props.item.requester }}</td>
                    <td>accepted</td>
                    <td>{{ props.item.permissions }}</td>
                    <td>{{ props.item.created }}</td>
                </tr>
            </template>
        </v-data-table>
        
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';
  import Pryv from '@/models/pryv';

  export default {
    name: 'Account',
    data: function () {
      return {
        user: {
          pryvUsername: this.$route.query.pryvUsername,
          pryvToken: this.$route.query.pryvToken
        },
        pryvModel: new Pryv(),
        campaignsModel: new Campaigns(),
        cmAccesses: [], // accesses originated from campaign manager
        cmAccessesColumns: [
          {
            text: 'View',
            value: 'view',
            align: 'center',
            sortable: false
          },
          {
            text: 'Campaign',
            value: 'campaign',
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
            text: 'Requester',
            value: 'requester',
            align: 'center',
            sortable: false
          },
          {
            text: 'Status',
            value: 'status',
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
          }
        ]
      }
    },
    async created() {
      await this.getAccesses();
      await this.getCampaignData();
    },
    methods: {
      async getAccesses() {
        try {
          const cmAccesses = await this.pryvModel.getAccesses({
            username: this.user.pryvUsername,
            token: this.user.pryvToken
          });
          console.info('got accesses', cmAccesses);
          this.cmAccesses = cmAccesses;
        } catch (e) {
          let errorData = null;
          if (e.response) {
            errorData = e.response;
          } else {
            errorData = e;
          }
          console.error('error while fetching accesses', errorData);
        }
      },
      async getCampaignData() {
        this.cmAccesses.forEach(async (access) => {
            try {
              const accessCampaign = await this.campaignsModel.getOneByAppId({
                pryvAppId: access.name,
              });
              access.campaignId = accessCampaign.id;
              access.requester = accessCampaign.requester;
              access.campaignTitle = accessCampaign.title;
              access.campaignDescription = accessCampaign.description;
              access.created = printDate(access.created);
              access.invitationId = accessCampaign.invitationId;
            } catch (e) {
              let errorData = null;
              if (e.response) {
                errorData = e.response;
              } else {
                errorData = e;
              }
              console.error('error while fetching campaigns', errorData);
            }
        });
      },
      openAccess(access) {
        console.info('openin access', access);
        this.$router.push({
          path: '/invitations/view',
          query: {
            campaignId: access.campaignId,
            invitationId: access.invitationId,
            accessId: access.id,
            requester: access.requester,
            requestee: this.user.pryvUsername,
            hasCancel: true,
            pryvToken: this.user.pryvToken,
          }
        });
      }
    }
  };

  function printDate(timestamp) {
    function pad2(n) { return n < 10 ? '0' + n : n }

    const date = new Date(timestamp * 1000);

    return pad2(date.getHours()) + ':' +
      pad2(date.getMinutes()) + ' ' +
      pad2( date.getDate()) + '/' +
      pad2(date.getMonth() + 1) + '/' +
      date.getFullYear().toString();
  }
</script>
