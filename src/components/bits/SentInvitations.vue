<template>
    <div class="SentInvitations">
        <h3>Invitations</h3>

        <v-data-table
          :headers="sentInvitationsColumns"
          :items="invitations"
          hide-actions
          class="elevation-0"
        >
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.campaign.title }}</td>
                    <td>{{ props.item.requestee.pryvUsername }}</td>
                    <td>{{ props.item.status }}</td>
                    <td>{{ props.item.accessToken }}</td>
                    <td>
                        <a :href="'' + props.item.url">
                            {{ props.item.url }}
                        </a>
                    </td>
                    <td>{{ props.item.created }}</td>
                    <td>{{ props.item.modified }}</td>
                </tr>
            </template>
        </v-data-table>

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
          {
            text: 'Campaign',
            value: 'campaign',
            align: 'center',
            sortable: false
          },
          {
            text: 'Pryv Username',
            value: 'pryvUsername',
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
            text: 'Access Token',
            value: 'accessToken',
            align: 'center',
            sortable: false
          },
          {
            text: 'Link',
            value: 'link',
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
            text: 'Modified',
            value: 'modified',
            align: 'center',
            sortable: false
          }
        ]
      }
    }
  }
</script>

