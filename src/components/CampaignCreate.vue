<template>
    <div id="CampaignCreate">
        <h2>Create Campaign</h2>
        <br>
        Title:<br>
        <input v-model="campaign.title" placeholder="enter title">
        <br>
        Description:<br>
        <textarea v-model="campaign.description" placeholder="enter description"></textarea>
        <br>
        Permissions:<br>
        <textarea rows="5" v-model="campaign.permissions"></textarea>
        <br>
        pryv app Id (optional):<br>
        <input type="text" name="campaign.pryvAppId" placeholder="enter Pryv app Id">
        <br><br>
        <button v-on:click="back">Back</button><button v-on:click="save">Save</button><button v-on:click="create">Create</button>
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';

  export default {
    name: 'CampaignCreate',
    data () {
      return {
        user: {
          username: 'empty'
        },
        campaignsModel: new Campaigns({
          username: this.$route.params.username || 'bob'
        }),
        campaign: {
          title: '',
          description: '',
          created: null,
          permissions: '[{\n' +
          ' "streamId":"diary",\n' +
          ' "level":"read",\n' +
          ' "defaultName":"Diary"\n' +
          '}]',
          pryvAppId: ''
        }
      }
    },
    created() {
      this.user.username = this.$route.params.username;
    },
    methods: {
      back() {
        this.$router.replace('/account/' + this.user.username);
      },
      async create() {
        console.log('creatin');
        let campaignToCreate = {
          title: this.campaign.title,
          description: this.campaign.description,
          pryvAppId: this.campaign.pryvAppId
        };
        try {
          campaignToCreate.permissions = JSON.parse(this.campaign.permissions);
        } catch (e) {
          return alert('error in permissions JSON parsing', e);
        }

        let response;
        try {
          response = await this.campaignsModel.create({
            campaign: campaignToCreate
          });
          console.log('campaign created succesfully', response.status, response.body);
          this.$router.replace('/account/' + this.user.username);
        } catch (e) {
          const errorBody = e.response.body;
          console.log('got error creating campaign', errorBody);
          alert(JSON.stringify(errorBody))
        }
      },
      save() {
        console.log('savin');
        alert('not implemented yet');
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #CampaignCreate {
    }
</style>