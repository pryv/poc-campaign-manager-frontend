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
        <br><br>
        <BackButton :buttonText="backButtonText"></BackButton><button @click="create">Create</button>
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';

  import BackButton from './bits/BackButton';

  export default {
    name: 'CampaignCreate',
    components: {
      BackButton
    },
    data () {
      return {
        user: {
          username: this.$route.query.username,
          token: this.$route.query.token
        },
        campaignsModel: new Campaigns(),
        campaign: {
          title: '',
          description: '',
          permissions: '[{\n' +
          ' "streamId":"diary",\n' +
          ' "level":"read",\n' +
          ' "defaultName":"Diary"\n' +
          '}]',
          pryvAppId: ''
        },
        backButtonText: 'Cancel',
      }
    },
    methods: {
      async create() {
        let campaignToCreate = {
          title: this.campaign.title,
          description: this.campaign.description
        };
        try {
          campaignToCreate.permissions = JSON.parse(this.campaign.permissions);
        } catch (e) {
          return alert('error in permissions JSON parsing', e);
        }

        let response;
        try {
          response = await this.campaignsModel.create({
            campaign: campaignToCreate,
            user: this.user
          });
          alert('campaign created succesfully' + JSON.stringify(response.body));
          this.$router.back();
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