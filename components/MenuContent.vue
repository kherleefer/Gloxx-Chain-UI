<template>
  <ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item @click="gotoExplorer">
          <ion-icon :icon="planetOutline" class="ion-margin-end"/>
          Glx-explorer
        </ion-item>
        <ion-item @click="gotoUtility">
          <ion-icon :icon="buildOutline" class="ion-margin-end"/>
          Utility
        </ion-item>
        <ion-item @click="gotoWhitepaper">
          <ion-icon :icon="documentTextOutline" class="ion-margin-end"/>
          Whitepaper
        </ion-item>

        <ion-item-divider>
          <ion-label>Help & Support</ion-label>
        </ion-item-divider>

        <ion-item @click="goToHelp">
          <ion-icon :icon="helpOutline" class="ion-margin-end"/>
          Help Center
        </ion-item>
        <ion-item @click="gotoFAQ">
          <ion-icon :icon="helpCircleOutline" class="ion-margin-end"/>
          FAQ
        </ion-item>

        <ion-item-divider>
          <ion-label>Legal & Information</ion-label>
        </ion-item-divider>

        <ion-item @click="gotoTerms">
          <ion-icon :icon="documentOutline" class="ion-margin-end"/>
          Terms of Use
        </ion-item>
        <ion-item @click="gotoPrivacy">
          <ion-icon :icon="lockClosedOutline" class="ion-margin-end"/>
          Privacy Policy
        </ion-item>

        <ion-item-divider>
          <ion-label>Account</ion-label>
        </ion-item-divider>

        <ion-item @click="goToSettings">
          <ion-icon :icon="cogOutline" class="ion-margin-end"/>
          Settings
        </ion-item>
        <ion-item @click="handleLogout">
          <ion-icon :icon="logOutOutline" class="ion-margin-end"/>
          Logout
        </ion-item>

        <ion-item-divider>
          <ion-label>Connect With Us</ion-label>
        </ion-item-divider>

        <div class="social-container ion-padding">
          <ion-button fill="clear" class="social-button" @click="openSocialLink('telegram')">
            <ion-icon :icon="paperPlaneOutline" />
          </ion-button>
          <ion-button fill="clear" class="social-button" @click="openSocialLink('x')">
            <ion-icon :icon="logoTwitter" />
          </ion-button>
          <ion-button fill="clear" class="social-button" @click="openSocialLink('cmc')">
            <ion-icon :icon="trendingUpOutline" />
          </ion-button>
        </div>

        <ion-item-divider>
          <ion-label>App Info</ion-label>
        </ion-item-divider>
        
        <ion-item lines="none">
          <ion-label class="ion-text-center version-text">
            Version {{ appVersion }}
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, 
         IonIcon, IonItemDivider, IonLabel, IonButton } from '@ionic/vue';
import { menuController } from '@ionic/vue';
import { cogOutline, helpOutline, planetOutline, logOutOutline, documentTextOutline, 
         documentOutline, lockClosedOutline, helpCircleOutline, buildOutline,
         paperPlaneOutline, logoTwitter, trendingUpOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { PreferencesService } from '@/services/preferencesService';

const router = useRouter();

const closeMenu = async () => {
  await menuController.close('end');
};

const goToSettings = async () => {
  await closeMenu();
  router.push('/settings');
};

const goToHelp = async () => {
  await closeMenu();
  router.push('/help');
};

const handleLogout = async () => {
await closeMenu();
  try {
    const token = await PreferencesService.get('token');
    if (token) {
      await api.post('/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  } catch (error) {
    console.warn('Logout API call failed:', error);
  } finally {
    await PreferencesService.clear();
    await router.push('/login');
    history.pushState(null, '', '/login');
  }
};

const gotoExplorer = async () => {
  await closeMenu();
  router.push('/explorer');
};

const gotoWhitepaper = async () => {
  await closeMenu();
  router.push('/whitepaper');
};

const gotoTerms = async () => {
  await closeMenu();
  router.push('/terms');
};

const gotoPrivacy = async () => {
  await closeMenu();
  router.push('/privacy');
};

const gotoFAQ = async () => {
  await closeMenu();
  router.push('/faq');
};

const gotoUtility = async () => {
  await closeMenu();
  router.push('/utility');
};

const appVersion = '1.0.0'; // You can update this with your actual app version

const openSocialLink = async (platform: 'telegram' | 'x' | 'cmc') => {
  await closeMenu();
  const urls: { [key: string]: string } = {
    telegram: 'https://t.me/gloxx_chain',
    x: 'https://x.com/gloxx_chain',
    cmc: 'https://coinmarketcap.com/currencies/gloxx-chain'
  };
  window.open(urls[platform], '_blank');
};
</script>

<style scoped>
.version-text {
  font-size: 0.9em;
  color: var(--ion-color-medium);
}

.social-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.social-button {
  --padding-start: 0.5rem;
  --padding-end: 0.5rem;
}

social-button ion-icon {
  font-size: 1.5rem;
}

ion-menu ion-toolbar {
  --background: var(--gradient-primary);
  --color: white;
}

ion-item {
  --background-hover: rgba(128, 0, 128, 0.05);
  --ripple-color: rgba(128, 0, 128, 0.1);
}

ion-item-divider {
  --background: var(--ion-background-color);
  --color: var(--ion-color-primary);
  font-weight: 600;
}

social-button {
  --color: var(--ion-color-primary);
}

.version-text {
  color: var(--ion-color-medium);
}
</style>
