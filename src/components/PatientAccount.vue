<template>
    <div id="account">
        <h2>Account</h2>
        <div>
            username: {{ user.pryvUsername }}
        </div>

        <h3>Accesses</h3>
        <table>
            <thead>
            <th v-for="property in cmAccessesColumns">
                {{ property }}
            </th>
            </thead>
            <tbody>
            <tr v-for="access in cmAccesses">
                <button @click="">View</button>
                <td>
                    {{ access.campaignTitle }}
                </td>
                <td>
                    {{ access.campaignDescription }}
                </td>
                <td>
                    we do not have it yet
                </td>
                <td>
                    accepted
                </td>
                <td>
                    {{ access.permissions }}
                </td>
                <td>
                    {{ access.created }}
                </td>
            </tr>
            </tbody>
        </table>
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
          pryvUsername: this.$route.query.pryvUsername || null,
          pryvToken: this.$route.query.pryvToken || null
        },
        pryvModel: new Pryv(),
        campaignsModel: new Campaigns(),
        cmAccesses: [], // accesses originated from campaign manager
        cmAccessesColumns: [
          'View',
          'Campaign',
          'Description',
          'Requester',
          'Status',
          'Permissions',
          'Created'
        ],
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
                pryvUsername: this.user.pryvUsername,
                pryvAppId: access.name,
                accessToken: access.token
              });
              access.campaignTitle = accessCampaign.title;
              access.campaignDescription = accessCampaign.description;
              access.created = printDate(access.created);
            } catch (e) {
              let errorData = null;
              if (e.response) {
                errorData = e.response;
              } else {
                errorData = e;
              }
              console.error('error while fetching accesses', errorData);
            }
        });
      }
    }
  };

  function printDate(timestamp) {
    return new Date(timestamp * 1000).toString();
  }
</script>
