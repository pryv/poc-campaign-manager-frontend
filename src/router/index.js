import Vue from 'vue';
import Router from 'vue-router';
import CampaignList from '@/components/CampaignList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/campaigns',
      name: 'Campaigns',
      component: CampaignList
    }
  ]
});
