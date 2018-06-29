<template>
  <div class="ReceivedInvitations">

    <h3>received Invitations</h3>
    <table>
      <thead>
      <th v-for="property in receivedInvitationsColumns">
        {{ property }}
      </th>
      </thead>
      <tbody>
      <tr v-for="invitation in invitations">
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
  export default {
    name: 'ReceivedInvitations',
    props: [
      'invitations',
      'user'
    ],
    data: function () {
      return {
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
    methods: {
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
  }
</script>

