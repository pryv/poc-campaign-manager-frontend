<template>
    <div id="SignIn">
        <h2>Sign in</h2>

        <v-form v-model="valid">
            <v-text-field
              v-model="user.username"
              :rules="usernameRules"
              label="Username"
              required
              @keyup.enter="signIn"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :rules="passwordRules"
              label="Password"
              required
              type="password"
              @keyup.enter="signIn"
            ></v-text-field>
        </v-form>

        <v-btn 
          depressed 
          small 
          color="primary" 
          v-on:click="signIn" 
        >
          Sign in
        </v-btn>

        <br>
        Not a user yet? Sign up <router-link to="/signup">here</router-link>.

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
    name: 'SignIn',
    data () {
      return {
        usersModel: new Users(),
        user: {
          username: '',
          password: '',
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
          let errorText = 'Unknown error.';
          if ((e.response != null) && (e.response.body != null)) {
            const error = e.response.body.error;
            console.error(error);
            if (error.id === 'Invalid request structure') {
              const firstError = error.details[0];
              errorText = firstError.dataPath.substring(1, firstError.dataPath.length) + ' ' + firstError.message;
            } else {
              errorText = error.id + ': ' + error.details;
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
    #SignIn {
    }
</style>