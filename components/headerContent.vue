<template>
  <ion-header class="gradient-header">
    <ion-toolbar>
      
        <div class="flex items-center text-bold justify-between w-full px-4">
          <div class="flex items-center  ">
            <img width="70px" height="70px" src="@/asset/image/Gloxx-logo-lg.png" alt=""> 
            <br>
            <span class="text-lg font-semibold">Gloxx Chain</span>
          </div>
        
          <ion-buttons slot="end" class="menu-container">
            <ion-menu-button class="menu-button"></ion-menu-button>
          </ion-buttons>
        </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton } from '@ionic/vue';
</script>

<style scoped>
.gradient-header ion-toolbar {
  --background: var(--gradient-primary);
  --color: white;
}

.header-title {
  display: flex;
  align-items: center;
  color: white;
  padding: 0 16px;
}

.title-text {
  margin-left: 8px;
  font-weight: 500;
}

.menu-container {
  padding-right: 16px;
}

.menu-button {
  --color: white;
}

ion-toolbar {
  --min-height: 80px;
  --padding-start: 0;
  --padding-end: 0;
}
</style>