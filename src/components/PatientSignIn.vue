<template>
    <div id="SignIn">
        <h2>Sign in</h2>
        Username:
        <input v-model="user.pryvUsername" placeholder="enter username">
        <br>
        Password:
        <input type="password" v-model="user.pryvPassword" placeholder="enter password">
        <br>
        <button v-on:click="signIn">Sign in</button>
        <br>
        Not a user yet? Sign up <a href="https://sw.pryv.me/access/register.html">here</a>.
    </div>
</template>

<script>
  import Pryv from '@/models/pryv';

  export default {
    name: 'SignIn',
    data () {
      return {
        pryvModel: new Pryv(),
        user: {
          pryvUsername: null,
          pryvPassword: null,
        }
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