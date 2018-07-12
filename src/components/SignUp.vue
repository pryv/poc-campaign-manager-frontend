<template>
    <div id="SignUp">
        <h2>Sign up</h2>

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
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="user.confirmPassword"
              :rules="passwordRules"
              label="Confirm Password"
              required
              type="password"
            ></v-text-field>
        </v-form>

        <v-btn depressed small color="primary" v-on:click="signUp">Create Account</v-btn>

        <br>
        Already have an account? <a href="/signin">Sign in</a>
    </div>
</template>

<script>
  import Users from '@/models/users';

  export default {
    name: 'SignUp',
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
      async signUp() {
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
          console.log('got sign in response', signinResponse.body);
          user = signinResponse.body.user;
          this.$router.push({
            path: '/account',
            query: {
              id: user.id,
              username: user.username,
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
    #SignUp {
    }
</style>