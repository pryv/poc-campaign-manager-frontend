<template>
    <div id="CampaignCreate">
        <h2>Create Campaign</h2>
        <br>
        <v-form v-model="valid">
            <v-text-field
              v-model="campaign.title"
              :rules="titleRules"
              label="Title"
              required
            ></v-text-field>
            <v-textarea
              v-model="campaign.description"
              :rules="descriptionRules"
              label="Description"
              required
              rows="5"
              cols="70"
              auto-grow
            ></v-textarea>
        </v-form>
        <div v-if="isExpertPermissionsDisplay">
            <v-layout row>
                <v-flex xs12>
                    <v-textarea
                      v-model="campaign.permissionsText"
                      :rules="permissionsRules"
                      label="Permissions"
                      required
                    ></v-textarea>
                </v-flex>
            </v-layout>
        </div>
        <div v-else>
            <div v-for="(permission, index) in campaign.permissionsArray" >
                <v-layout row>
                <v-flex xs3>
                    <v-text-field
                      label="streamId"
                      v-model="permission.streamId"
                    ></v-text-field>
                </v-flex>
                <v-flex xs3>
                    <v-text-field
                      label="defaultName"
                      v-model="permission.defaultName"
                    ></v-text-field>
                </v-flex>
                <v-flex xs3>
                    <v-select
                      :items="levels"
                      label="Choose level"
                      solo
                      v-model="permission.level"
                    ></v-select>
                </v-flex>
                <v-flex xs3>
                    <v-btn depressed small color="primary" @click="removePermission(index)">
                        Remove
                    </v-btn>
                </v-flex>
                </v-layout>
            </div>

            <v-btn depressed small color="primary" @click="addRow()">
                Add
            </v-btn>
        </div>

        <v-btn depressed small color="primary" @click="switchMode()">
            {{ switchModeButtonText }}
        </v-btn>

        <v-layout row>
            <v-flex xs2 offset-xs4>
                <BackButton buttonText="Cancel"></BackButton>
            </v-flex>
            <v-flex xs2 >
                <v-btn depressed small color="primary" @click="create">
                    Create
                </v-btn>
            </v-flex>
        </v-layout>

        <v-snackbar
          v-model="snackbar.display"
          :color="snackbar.color"
          :timeout=6000
          :top="true"
        >
            {{ snackbar.text }}
            <v-btn
              dark
              flat
              @click="snackbar.display = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
  import Campaigns from '@/models/campaigns';

  import BackButton from './bits/BackButton';

  const DEFAULT_PERMISSIONS = [
    {
      streamId: 'diary',
      defaultName: 'Diary',
      level: 'read'
    },
    {
      streamId: 'heart',
      defaultName: 'Heart',
      level: 'read'
    }
  ];

  export default {
    name: 'CampaignCreate',
    components: {
      BackButton
    },
    data () {
      return {
        levels: [ 'read', 'contribute', 'manage'],
        user: {
          username: this.$route.query.username,
          token: this.$route.query.token
        },
        campaignsModel: new Campaigns(),
        campaign: {
          title: '',
          description: '',
          permissionsText: this.permissionsArrayAsText,
          permissionsArray: DEFAULT_PERMISSIONS
        },
        isExpertPermissionsDisplay: false,
        valid: false,
        titleRules: [
            v => !!v || 'Title is required'
        ],
        descriptionRules: [
            v => !!v || 'Description is required'
        ],
        permissionsRules: [
            v => !!v || 'Permissions are required'
        ],
        snackbar: {
          display: false,
          color: 'info',
          text: ''
        }
      }
    },
    methods: {
      async create() {
        let campaignToCreate = {
          title: this.campaign.title,
          description: this.campaign.description
        };

        if (this.isExpertPermissionsDisplay) {
          try {
            campaignToCreate.permissions = JSON.parse(this.campaign.permissionsText);
          } catch (e) {
            return this.showSnackbar({
              color: 'error',
              text: 'Error in permissions JSON parsing: ' + e
            });
          }
        } else {
          campaignToCreate.permissions = this.campaign.permissionsArray;
        }
        const permissionsError = this.hasPermissionsErrors(campaignToCreate.permissions);
        if (permissionsError != null) {
          return this.showSnackbar({
            color: 'error',
            text: 'Error: ' + permissionsError
          });
        }

        try {
          const response = await this.campaignsModel.create({
            campaign: campaignToCreate,
            user: this.user
          });
          this.$router.back();
        } catch (e) {
          const errorBody = e.response.body;
          this.showSnackbar({
            color: 'error',
            text: 'Error while creating campaign: ' + errorBody.error
          });
          console.error('got error creating campaign', errorBody);
        }
      },
      removePermission(index) {
        this.campaign.permissionsArray.splice(index, 1);
      },
      addRow() {
        this.campaign.permissionsArray.push({
          streamId: '',
          defaultName: '',
          level: 'read'
        });
      },
      switchMode() {
        if (! this.isExpertPermissionsDisplay) {
          this.campaign.permissionsText = JSON.stringify(this.campaign.permissionsArray, null, '\t');
        }
        this.isExpertPermissionsDisplay = ! this.isExpertPermissionsDisplay;
      },
      showSnackbar(params: {
        color: string,
        text: string
      }): void {
        this.snackbar.text = params.text;
        this.snackbar.color = params.color;
        this.snackbar.display = true;
      },
      hasPermissionsErrors(permissionsArray) {
        if (! Array.isArray(permissionsArray)) {
          return 'permissions should be an array';
        }

        if (permissionsArray.length === 0) {
          return 'permissions array is empty';
        }

        for(let i=0; i < permissionsArray.length; i++) {
          if (isStringEmptyOrNull(permissionsArray[i].level)) {
              return 'permission ' + i + ' is missing "level" parameter';
            }

          if (permissionsArray[i].streamId) {
            if (isStringEmptyOrNull(permissionsArray[i].defaultName)) {
              return 'permission ' + i + ' is missing "defaultName" parameter';
            }
          } else if (isStringEmptyOrNull(permissionsArray[i].tag)) {
            return 'permission ' + i + ' is missing "streamId" or "tag" parameter';
          }
        }
        return null;
      }
    },
    computed: {
      switchModeButtonText() {
        if (this.isExpertPermissionsDisplay) {
          return 'Normal mode';
        } else {
          return 'Expert mode';
        }
      },
      permissionsArrayAsText() {
        return JSON.stringify(this.permissionsArray, null, '\t');
      }
    }
  };

  function isStringEmptyOrNull(s) {
    if (s == null) return true;
    if (s === '') return true;
    return false;
  }
</script>

<!-- styling for the component -->
<style>
    #CampaignCreate {
    }
</style>