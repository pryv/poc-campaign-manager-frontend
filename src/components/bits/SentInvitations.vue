<template>
    <div class="SentInvitations">
        <h3>Invitations</h3>
        <table>
            <thead>
            <th v-for="property in sentInvitationsColumns">
                {{ property }}
            </th>
            </thead>
            <tbody>
                <tr v-for="invit in invitations">
                    <td>
                        {{ invit.campaign.title }}
                    </td>
                    <td>
                        {{ invit.requestee.pryvUsername }}
                    </td>
                    <td>
                        {{ invit.status }}
                    </td>
                    <td>
                        {{ invit.accessToken }}
                    </td>
                    <td>
                        <a :href="'' + invit.url">
                            {{ invit.url }}
                        </a>
                    </td>
                    <td>
                        {{ invit.created }}
                    </td>
                    <td>
                        {{ invit.modified }}
                    </td>
                </tr>
                </tbody>
        </table>

    </div>
</template>

<script>
  export default {
    name: 'SentInvitations',
    props: [
      'invitations'
    ],
    data: function () {
      return {
        sentInvitationsColumns: [
          'Campaign',
          'Pryv username',
          'Status',
          'Access Token',
          'Link',
          'Created',
          'Modified'
        ]
      }
    }
  }
</script>

