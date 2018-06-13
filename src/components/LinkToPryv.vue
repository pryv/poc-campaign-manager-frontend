<template>
    <div id="LinkToPryv">
        <h2>Link to your Pryv</h2>
        <br>

        Pryv username
        <input v-model="pryvUser.username" placeholder="enter username">
        <br>

        Pryv password
        <input v-model="pryvUser.password" placeholder="enter password" type="password">
        
        <button v-on:click="back">Back</button><button v-on:click="link">Link</button>
    </div>
</template>

<script>
  import Users from '@/models/users';
  import Pryv from '@/models/pryv';

  export default {
    name: 'LinkToPryv',
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
          id: this.$route.query.id
        }
      }
    },
    methods: {
      back() {
        this.$router.back();
      },
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
          alert('error while linking to Pryv' + JSON.stringify(msg));
          console.error('error while linking to Pryv', msg);
        }

      }
    }
  };
</script>

<!-- styling for the component -->
<style>
    #LinkToPryv {
    }
</style>