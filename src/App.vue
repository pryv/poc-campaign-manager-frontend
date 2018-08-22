<template>
    <div id="app">
        <head>
            <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
        </head>
        <v-app id="inspire">
            <v-toolbar
              color="primary" dark fixed app flat>
                <v-layout row align-center>
                    <v-flex xs1>
                        <v-toolbar-side-icon>
                            <img src="@/assets/logo-128-white.png">
                        </v-toolbar-side-icon>
                    </v-flex>
                    <v-flex xs2>
                        <v-toolbar-title pl-4>Campaign Manager</v-toolbar-title>
                    </v-flex>
                    <v-flex xs1 offset-xs8>
                        {{ pryvDomain }}
                    </v-flex>
                </v-layout>
            </v-toolbar>

            <v-content>
                <v-container>
                    <v-layout align-center justify-center>
                        <router-view>
                        </router-view>
                    </v-layout>
                </v-container>
            </v-content>

            <v-footer color="primary" dark fixed app flat>
                <v-layout justify-end mr-4>
                    <span class="white--text">&copy; 2018 Pryv  </span>
                </v-layout>


            </v-footer>
        </v-app>
    </div>
</template>

<script>
  import config from '@/utils/config';

  export default {
    name: 'App',
    components: {},
    data: function () {
      return {
          pryvDomain: config.pryv.domain,
      }
    },
  };
</script>

<style>
    #app {
        font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    img {
        object-fit: contain;
    }

</style>