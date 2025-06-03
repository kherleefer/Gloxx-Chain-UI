<template>
  <ion-app>
    <MenuContent />
    <ion-content id="main-content">
      <ion-router-outlet :animation="false" />
      <loader v-if="isLoadingRoute" :progress="loadingProgress" />
    </ion-content>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/vue';
import { ref, onMounted, onBeforeMount } from 'vue';
import loader from "@/components/loader.vue";
import MenuContent from "@/components/MenuContent.vue";
import { App as CapacitorApp } from '@capacitor/app';
import { useRouter } from 'vue-router';
import { AdMob, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { PreferencesService } from '@/services/preferencesService';

const isLoadingRoute = ref(false);
const loadingProgress = ref(0);
const router = useRouter();

const updateProgress = (start: number, end: number, delay: number) => {
  return new Promise<void>((resolve) => {
    const step = () => {
      if (loadingProgress.value < end) {
        loadingProgress.value += 1;
        setTimeout(step, delay);
      } else {
        resolve();
      }
    };
    step();
  });
};

router.beforeEach((to, from, next) => {
  const fromSection = from.path.split('/')[1];
  const toSection = to.path.split('/')[1];

  if (fromSection !== toSection) {
    isLoadingRoute.value = true;
    loadingProgress.value = 0;
    // Start initial loading animation without blocking navigation
    updateProgress(0, 80, 10);
  }
  next();
});

router.beforeResolve((to, from, next) => {
  if (isLoadingRoute.value) {
    // Continue loading animation without blocking
    updateProgress(80, 95, 15);
  }
  next();
});

router.afterEach(() => {
  if (isLoadingRoute.value) {
    // Complete the loading animation
    updateProgress(95, 100, 20).then(() => {
      setTimeout(() => {
        isLoadingRoute.value = false;
        loadingProgress.value = 0;
      }, 200);
    });
  }
});
// these block keeps a user loggedin 
const autoLogin = async () => {
  const authToken = await PreferencesService.get('authtoken');
  if (authToken) {
    // you can implement a better session handler or stick to these implementation
    await router.push("/login");
    await router.replace("tabs/home");

  };
};
onMounted(async () => {
  autoLogin();
  await AdMob.initialize(); // this initiate google ads Globally 
  const listener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => { //this ensures Android and IOS Navigation Keys works properly if you are targeting to build mobile App with this code
    if (canGoBack) {
      router.back();
    } else {
      CapacitorApp.exitApp();
    };
  });
  const removeListener = listener.remove;


});
/*
onBeforeMount(() => {
  if (removeListener) {
    remove.Listener();
  };
});
*/
</script>

<style></style>
