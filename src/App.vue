<template>
  <div id="app">
    <img src="./assets/logo.png">
    <CampaignList>

    </CampaignList>
    <router-view/>
  </div>
</template>

<script>
  import CampaignList from './components/CampaignList.vue';

export default {
  name: 'App',
  components: {
    CampaignList
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
