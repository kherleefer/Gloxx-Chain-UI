import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import LoginPage from '../auth/Login.vue';
import RegisterPage from '../auth/Registration.vue';
import { authGuard } from './auth-guard';

import Settings from '../views/Settings.vue';
import AccountSettings from '../components/AccountSettings.vue';
import SecuritySettings from '../components/SecuritySettings.vue';
import NotificationSettings from '../components/NotificationSettings.vue';
import AppPreferences from '../components/AppPreferences.vue';
import BlockchainSettings from '../components/BlockchainSettings.vue';
import LegalSupport from '../components/LegalSupport.vue';
import DeveloperOptions from '../components/DeveloperOptions.vue';

const routes: Array<RouteRecordRaw> = [
 
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/explorer',
    component: () => import('@/views/Glx-explorer.vue')
  },
  {
    path: '/utility',
    component: () => import('@/views/UtilityPage.vue')
  },
  {
    path: '/settings',
    component: Settings
  },
  { path: '/settings/account', 
    component: AccountSettings, 
  },
  { path: '/settings/security', component: SecuritySettings, },
  { path: '/settings/notifications', component: NotificationSettings, },
  { path: '/settings/app-preferences', component: AppPreferences, },
  { path: '/settings/blockchain', component: BlockchainSettings, },
  { path: '/settings/legal', component: LegalSupport, },
  { path: '/settings/developer', component: DeveloperOptions, },

  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/register',
    component: RegisterPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'tasks',
        component: () => import('@/views/TasksPage.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfilePage.vue')
      },
      
      {
        path: 'Wallet',
        component: () => import('@/views/WalletPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(authGuard);

// Optional: Handle when auth state changes
window.addEventListener('storage', (event) => {
  if (event.key === 'token' && !event.newValue) {
    router.push('/login');
  }
});

export default router
