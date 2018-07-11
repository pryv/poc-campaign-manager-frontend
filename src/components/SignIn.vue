<template>
    <div id="SignIn">
        <h2>Sign in</h2>

        <v-form v-model="valid">
            <v-text-field
              v-model="user.username"
              :rules="usernameRules"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :rules="passwordRules"
              label="Password"
              required
            ></v-text-field>
            <v-text-field
              v-model="user.confirmPassword"
              :rules="passwordRules"
              label="Confirm Password"
              required
            ></v-text-field>
        </v-form>

        <v-btn depressed small color="primary" v-on:click="signIn">Sign in</v-btn>
        
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
          username: '',
          password: '',
          confirmPassword: ''
        },
        valid: false,
        usernameRules: [
          v => !!v || 'Username is required',
          v => v.length <= 20 || 'Username must be less than 20 characters'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => v.length <= 20 || 'Password must be less than 20 characters'
        ]
      }
    },
    created() {
    },
    methods: {
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
              username: user.username,
              pryvUsername: user.pryvUsername,
              pryvToken: user.pryvToken,
              token: user.token,
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