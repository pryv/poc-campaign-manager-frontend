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
                <v-container align-content-center>
                    <router-view>
                    </router-view>
                </v-container>
            </v-content>
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

    table {
        border: 2px solid #42b983;
        border-radius: 3px;
        background-color: #fff;
    }

    th, td {
        min-width: 120px;
        padding: 10px 20px;
    }

    td {
        background-color: #f9f9f9;
    }

    th {
        background-color: #f0f0f0;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
</style>