<template>
  <ion-page>
    <ion-header class="gradient-header">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button cl default-href="/tabs/home"></ion-back-button>
                </ion-buttons>
                <ion-title >utility</ion-title>
            </ion-toolbar>
        </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card @click="navigateTo('dapp')">
              <ion-card-header class="card-header">
                <ion-icon :icon="appsOutline" size="large"></ion-icon>
                <ion-card-title>DApps</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Explore decentralized applications built on our platform
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card @click="navigateTo('defi')">
              <ion-card-header class="card-header">
                <ion-icon :icon="cashOutline" size="large"></ion-icon>
                <ion-card-title>DeFi</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Access decentralized finance tools and services
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card @click="navigateTo('nft')">
              <ion-card-header class="card-header">
                <ion-icon :icon="imageOutline" size="large"></ion-icon>
                <ion-card-title>NFT Marketplace</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Trade and collect unique digital assets
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card @click="navigateTo('staking')">
              <ion-card-header class="card-header">
                <ion-icon :icon="lockClosedOutline" size="large"></ion-icon>
                <ion-card-title>Staking</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                Stake your tokens and earn rewards
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonIcon, IonButtons,
  IonBackButton
} from '@ionic/vue';
import { 
  appsOutline, cashOutline, imageOutline,
  lockClosedOutline, arrowBackOutline
} from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (destination: string) => {
  router.push(`/utility/${destination}`);
};
</script>

<style scoped>
ion-card {
  cursor: pointer;
  transition: transform 0.2s;
}

ion-card:hover {
  transform: translateY(-5px);
}

ion-icon {
  color: var(--ion-color-primary);
  font-size: 2em;
  margin-bottom: 10px;
}

ion-card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

ion-card-content {
  text-align: center;
}

.gradient-header ion-toolbar {
  --background: var(--gradient-primary);
  --color: white;
 }

</style>
