import Vue from 'vue';
import Router from 'vue-router';
import Account from '@/components/Account';
import CampaignCreate from '@/components/CampaignCreate';
import CampaignDisplay from '@/components/CampaignDisplay';
import InvitationCreate from '@/components/InvitationCreate';
import InvitationDisplay from '@/components/InvitationDisplay';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/account/:username',
      name: 'Account',
      component: Account
    },
    {
      path: '/campaigns/new/:username',
      name: 'CampaignCreate',
      component: CampaignCreate
    },
    {
      path: '/invitations/new',
      name: 'InvitationCreate',
      component: InvitationCreate
    },
    {
      path: '/invitations/view',
      name: 'InvitationDisplay',
      component: InvitationDisplay
    },
    {
      path: '/campaigns/view',
      name: 'CampaignDisplay',
      component: CampaignDisplay
    }
  ],
  mode: 'history'
});
