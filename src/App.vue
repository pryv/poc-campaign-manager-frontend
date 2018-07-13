<template>
    <div id="app">
        <head>
            <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
        </head>
        <v-app id="inspire">
            <v-toolbar
              color="primary" dark fixed app flat>
                <v-btn color="primary" depressed small><i class="fa fa-home"></i></v-btn>
                <v-toolbar-title >Pryv Campaign Manager</v-toolbar-title>
            </v-toolbar>

            <!--<img src="./assets/logo-128.png">-->

            <v-content>
                <v-container>
                    <v-layout align-center justify-center>
                        <router-view>
                        </router-view>
                    </v-layout>
                </v-container>
            </v-content>

            <v-footer color="primary" dark fixed app flat>
                <v-layout justify-end>
                    <span class="white--text">&copy; 2018 Pryv  </span>
                </v-layout>


            </v-footer>
        </v-app>
    </div>
</template>

<script>
  export default {
    name: 'App',
    components: {},
    data: function () {
      return {}
    },
    created: function () {
    },
    methods: {
    }
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

</style>