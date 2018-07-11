<template>
    <div id="SignIn">
        <h2>Patient Sign in</h2>
        Domain: {{ pryvDomain }}
        <br>

        <v-form v-model="valid">
            <v-text-field
              v-model="user.pryvUsername"
              :rules="usernameRules"
              label="Pryv Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.pryvPassword"
              :rules="passwordRules"
              label="Pryv Password"
              required
            ></v-text-field>
        </v-form>

        <v-btn depressed small color="primary" v-on:click="signIn">Sign in</v-btn>

    </div>
</template>

<script>
  import Pryv from '@/models/pryv';
  import config from '@/models/config';

  export default {
    name: 'SignIn',
    data () {
      return {
        pryvModel: new Pryv(),
        user: {
          pryvUsername: null,
          pryvPassword: null,
        },
        pryvDomain: config.pryv.domain,
        valid: false,
        usernameRules: [
          v => !!v || 'Username is required',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
        ]
      }
    },
    created() {
    },
    methods: {
      async signIn() {
        try {
          const signInResponse = await this.pryvModel.signIn({
            username: this.user.pryvUsername,
            password: this.user.pryvPassword,
          });
          if (signInResponse.body.error) {
            return console.error('got error signin in to pryv' + signInResponse.error);
          }

          this.$router.push({
            path: '/patientAccount',
            query: {
              pryvUsername: this.user.pryvUsername,
              pryvToken: signInResponse.body.token
            }
          })
        } catch (e) {
          let msg = e;
          if (e.response) {
            msg = e.response;
          }
          alert('error while signing in to Pryv' + JSON.stringify(msg));
          console.error('error while signing in to Pryv', msg);
        }
      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #SignIn {
    }
</style>