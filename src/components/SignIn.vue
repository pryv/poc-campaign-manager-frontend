<template>
    <div id="SignIn">
        <h2>Sign in</h2>
        Username:
        <input v-model="user.username" placeholder="enter username">
        <br>
        Password:
        <input type="password" v-model="user.password" placeholder="enter password">
        <br>
        <button v-on:click="signIn">Sign in</button>
        <br>
        Not a user yet? Sign up <a href="/signup">here</a>.
    </div>
</template>

<script>
  import Users from '@/models/users';

  export default {
    name: 'SignIn',
    data () {
      return {
        usersModel: new Users(),
        user: {
          username: null,
          password: null,
          confirmPassword: null
        }
      }
    },
    created() {
    },
    methods: {
      back() {
        this.$router.back();
      },
      async signIn() {
        try {
          const response = await this.usersModel.signIn({
            username: this.user.username,
            password: this.user.password
          });
          console.log('got response', response.body);
          const user = response.body.user;
          this.$router.push({
            path: '/account',
            query: {
              id: user.id,
              username: user.username
            }
          });
        } catch (e) {
          if (e.response) {
            console.error(e.response.body);
            alert(JSON.stringify(e.response.body));
          } else {
            console.error(e);
          }
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