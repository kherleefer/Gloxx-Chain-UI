<template>
  <ion-page>
    <MenuContent />
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <GlxOutlineIcon />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tasks" href="/tabs/tasks">
          <ion-icon :icon="cashOutline" />
          <ion-label>Tasks</ion-label>
        </ion-tab-button>

         

        <ion-tab-button tab="Wallet" href="/tabs/Wallet">
          <ion-icon :icon="walletOutline" />
          <ion-label>Wallet</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personCircleOutline" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { personCircleOutline, cashOutline, trophyOutline, walletOutline } from 'ionicons/icons';
import MenuContent from '@/components/MenuContent.vue';
import GlxOutlineIcon from '@/components/GlxOutlineIcon.vue';
</script>

<style scoped>
ion-tab-bar {
  --background: var(--gradient-primary);
  border-top: none;
  padding: 5px;
}

ion-tab-button {
  --color: rgba(255, 255, 255, 0.7);
  --color-selected: white;
  transition: transform 0.2s;
}

ion-tab-button.tab-selected {
  transform: translateY(-2px);
}
</style>
