<template>
  <div class="Campaign">

    <v-layout row v-if="hasRequester" mb-3>
      <v-flex xs3 class="alignRight">
        Requester:
      </v-flex>
      <v-flex xs8 offset-xs1 class="alignLeft">
        {{ campaign.requester }}
      </v-flex>
    </v-layout>
    <v-layout row mb-3>
      <v-flex xs3 class="alignRight">
        Title:
      </v-flex>
      <v-flex xs8 offset-xs1 class="alignLeft">
        {{ campaign.title }}
      </v-flex>
    </v-layout>
    <v-layout mb-3>
      <v-flex xs3 class="alignRight">
        Description:
      </v-flex>
      <v-flex xs8 offset-xs1 class="alignLeft">
        
          <VueMarkdown :source="campaign.description">
          </VueMarkdown>
        
      </v-flex>
    </v-layout>
    <v-layout row mb-3>
      <v-flex xs3 class="alignRight">
        Permissions:
      </v-flex>
      <v-flex xs8 offset-xs1 class="alignLeft">
        {{ minimizedPermissions }}
      </v-flex>
    </v-layout>
    <v-layout row mb-3>
      <v-flex xs3 class="alignRight">
        Pryv AppId:
      </v-flex>
      <v-flex xs8 offset-xs1 class="alignLeft">
        {{ campaign.pryvAppId }}
      </v-flex>
    </v-layout>
    <v-layout row mb-3>
      <v-flex xs3 class="alignRight">
        Created:
      </v-flex>
      <v-flex xs8 offset-xs1 class="alignLeft">
        {{ createdReadable }}
      </v-flex>
    </v-layout>
    <v-layout row v-if="isCancelled">
      <v-flex xs3 class="alignRight">
        <v-subheader>Cancelled:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-subheader>{{ cancelledReadable }}</v-subheader>
      </v-flex>
    </v-layout>

  </div>
</template>

<script>
  import VueMarkdown from 'vue-markdown';

  import helpers from '@/utils/helpers';

  export default {
    name: 'Campaign',
    components: {
      VueMarkdown,
    },
    props: [
      'campaign',
    ],
    computed: {
      createdReadable() {
        return printDate(this.campaign.created);
      },
      hasRequester() {
        return (this.campaign.requester != null);
      },
      isCancelled() {
        return this.campaign.status === 'cancelled';
      },
      cancelledReadable() {
        return printDate(this.campaign.modified);
      },
      minimizedPermissions() {
        return helpers.minimizePermissions(this.campaign.permissions);
      }
    }
  }

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

<style>
    .alignLeft {
        text-align: left;
    }

    .alignRight {
        text-align: right;
    }

</style>