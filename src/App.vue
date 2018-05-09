<template>
    <div id="app">
        <img src="https://pryv.com/wp-content/themes/pryv/assets/images/logo-pryv.png">

        <router-view>
        </router-view>

        <router-link v-bind:to="'/account'">Account</router-link>
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