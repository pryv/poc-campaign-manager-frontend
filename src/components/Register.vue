<template>
    <div id="Register">
        <h1>Register</h1>
        Username:
        <input v-model="user.username" placeholder="enter username">
        <br>
        Password:
        <input type="password" v-model="user.password" placeholder="enter password">
        <br>
        Confirm password:
        <input type="password" v-model="user.confirmPassword" placeholder="enter password">
        <br>
        <button v-on:click="back">Back</button><button v-on:click="register">Register</button>
    </div>
</template>

<script>
  import Users from '@/models/users';

  export default {
    name: 'Register',
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
      async register() {
        console.log('clic')
        if (this.user.password !== this.user.confirmPassword) {
          return alert('passwords do not match!');
        }
        try {
          const response = await this.usersModel.create({
            username: this.user.username,
            password: this.user.password
          });
          console.log('got user creation response', response.body);
          let user = response.body.user;
          const signinResponse = await this.usersModel.signIn({
            username: this.user.username,
            password: this.user.password
          });
          console.log('got sign in response', response.body);
          user = response.body.user;
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
    #Register {
    }
</style>