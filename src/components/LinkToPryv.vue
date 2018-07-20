<template>
    <div id="LinkToPryv">
        <h2>Link to your Pryv account on {{ pryvDomain }}</h2>
        <br>

        <v-form v-model="valid">
            <v-text-field
              v-model="pryvUser.username"
              :rules="usernameRules"
              label="Pryv Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="pryvUser.password"
              :rules="passwordRules"
              label="Pryv Password"
              required
              type="password"
            ></v-text-field>
        </v-form>

        <br>
        <BackButton :buttonText="backButtonText"></BackButton>
        <v-btn depressed small color="primary" v-on:click="link">
            Sync
        </v-btn>

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
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';

  import BackButton from './bits/BackButton';
  import config from '@/models/config';

  export default {
    name: 'LinkToPryv',
    components: {
      BackButton
    },
    data () {
      return {
        usersModel: new Users(),
        pryvModel: new Pryv(),
        pryvUser: {
          username: '',
          password: ''
        },
        user: {
          username: this.$route.query.username,
          id: this.$route.query.id,
          token: this.$route.query.token,
        },
        pryvDomain: config.pryv.domain,
        backButtonText: 'Cancel',
        valid: false,
        usernameRules: [
          v => !!v || 'Username is required',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
        ],
        snackbar: {
          display: false,
          color: 'info',
          text: ''
        }
      }
    },
    methods: {
      async link() {
        try {
          const signInResponse = await this.pryvModel.signIn({
            username: this.pryvUser.username,
            password: this.pryvUser.password,
          });
          if (signInResponse.body.error) {
            return console.error('got error signin in to pryv' + signInResponse.error);
          }
          const pryvPersonalToken = signInResponse.body.token;
          const linkToPryvResponse = await this.usersModel.update({
            username: this.user.username,
            token: this.user.token,
            pryvUsername: this.pryvUser.username,
            pryvToken: pryvPersonalToken,
          });

          if (linkToPryvResponse.body.error) {
            return console.error('got error link pryv account ' + linkToPryvResponse.body.error);
          }

          console.info('linked account to pryv');
          this.$router.back();
        } catch (e) {
          let msg = e;
          if (e.response) {
            msg = e.response;
          }
          this.showSnackbar({
            color: 'error',
            text: 'Error while linking to Pryv'
          });
          console.error('error while linking to Pryv', msg);
        }

      },
      showSnackbar(params: {
        color: string,
        text: string
      }): void {
        this.snackbar.text = params.text;
        this.snackbar.color = params.color;
        this.snackbar.display = true;
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #LinkToPryv {
    }
</style>