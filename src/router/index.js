import Vue from 'vue';
import Router from 'vue-router';
import Register from '@/components/Register';
import SignIn from '@/components/SignIn';
import Account from '@/components/Account';
import CampaignCreate from '@/components/CampaignCreate';
import CampaignDisplay from '@/components/CampaignDisplay';
import InvitationCreate from '@/components/InvitationCreate';
import InvitationDisplay from '@/components/InvitationDisplay';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/account',
      name: 'Account',
      component: Account
    },
    {
      path: '/campaigns/new',
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
