<template>
  <div class="Campaign">

    <table>
      <tr v-if="hasRequester">
        <td>Requester:</td>
        <td>{{ campaign.requester }}</td>
      </tr>
      <tr>
        <td>Title:</td>
        <td>{{ campaign.title }}</td>
      </tr>
      <tr>
        <td>Description:</td>
        <td>{{ campaign.description }}</td>
      </tr>
      <tr>
        <td>Permissions:</td>
        <td>{{ campaign.permissions }}</td>
      </tr>
      <tr>
        <td>Pryv App Id:</td>
        <td>{{ campaign.pryvAppId }}</td>
      </tr>
      <tr>
        <td>Created:</td>
        <td>{{ createdReadable }}</td>
      </tr>
    </table>

  </div>
</template>

<script>
  export default {
    name: 'Campaign',
    props: [
      'campaign'
    ],
    computed: {
      createdReadable() {
        return new Date(this.campaign.created * 1000).toString();
      },
      hasRequester() {
        return (this.campaign.requester != null);
      }
    }
  }
</script>

