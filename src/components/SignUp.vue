<template>
    <div id="SignUp">
        <h2>Sign up</h2>

        <v-form v-model="valid">
            <v-text-field
              v-model="user.username"
              :rules="usernameRules"
              label="Username"
              required
              @keyup.enter="signUp"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :rules="passwordRules"
              label="Password"
              required
              type="password"
              @keyup.enter="signUp"
            ></v-text-field>
            <v-text-field
              v-model="user.confirmPassword"
              :rules="passwordRules"
              label="Confirm Password"
              required
              type="password"
              @keyup.enter="signUp"
            ></v-text-field>
        </v-form>

        <v-btn 
          depressed 
          small 
          color="primary" 
          @click="signUp"
        >
          Create Account
        </v-btn>

        <br>
        Already have an account? <router-link to="/signin">Sign in</router-link>.

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
        ],
        snackbar: {
          display: false,
          color: 'info',
          text: ''
        }
      }
    },
    created() {
    },
    methods: {
      async signUp() {
        if (this.user.password !== this.user.confirmPassword) {
          return this.showSnackbar({
            color: 'error',
            text: 'Passwords do not match!'
          });
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
          let errorText = 'Unknown error';
          if (e.response && e.response.body) {
            const error = e.response.body.error;
            console.error(error);
            if (error.id === 'Invalid request structure') {
              const firstError = error.details[0];
              errorText = firstError.dataPath.substring(1, firstError.dataPath.length) + ' ' + firstError.message;
            } else {
              errorText = e.response.body.error.id;
            }
          } else {
            console.error(e);
          }
          this.showSnackbar({
              color: 'error',
              text: errorText,
          });
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
    #SignUp {
    }
</style>