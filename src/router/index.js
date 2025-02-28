/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
import Vue from 'vue';
import Router from 'vue-router';
import SignUp from '@/components/SignUp';
import SignIn from '@/components/SignIn';
import Account from '@/components/Account';
import LinkToPryv from '@/components/LinkToPryv';
import CampaignCreate from '@/components/CampaignCreate';
import CampaignDisplay from '@/components/CampaignDisplay';
import InvitationCreate from '@/components/InvitationCreate';
import InvitationDisplay from '@/components/InvitationDisplay';

import PatientSignIn from '@/components/PatientSignIn';
import PatientAccount from '@/components/PatientAccount';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'signin'
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
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
      path: '/patientSignIn',
      name: 'PatientSignIn',
      component: PatientSignIn
    },
    {
      path: '/patientAccount',
      name: 'PatientAccount',
      component: PatientAccount
    },
    {
      path: '/pryv/link',
      name: 'LinkToPryv',
      component: LinkToPryv
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
  ]
});
