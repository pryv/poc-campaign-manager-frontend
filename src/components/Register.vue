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
          this.usersModel.create({
            username: this.username,
            password: this.password
          });
        } catch (e) {

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