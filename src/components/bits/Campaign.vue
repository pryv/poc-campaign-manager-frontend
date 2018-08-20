<template>
  <div class="Campaign">

    <v-layout row v-if="hasRequester">
      <v-flex xs4>
        <v-subheader>Requester:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-subheader>{{ campaign.requester }}</v-subheader>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Title:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-subheader>{{ campaign.title }}</v-subheader>
      </v-flex>
    </v-layout>
    <v-layout row my-2>
      <v-flex xs4>
        <v-subheader>Description:</v-subheader>
      </v-flex>
      <v-flex xs8 justify-start>
        <VueMarkdown :source="campaign.description">
        </VueMarkdown>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Permissions:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-subheader>{{ campaign.permissions }}</v-subheader>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Pryv AppId:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-subheader>{{ campaign.pryvAppId }}</v-subheader>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs4>
        <v-subheader>Created:</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-subheader>{{ createdReadable }}</v-subheader>
      </v-flex>
    </v-layout>
    <v-layout row v-if="isCancelled">
      <v-flex xs4>
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
    #app {
        text-align: left;
    }

</style>