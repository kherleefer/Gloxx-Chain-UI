<template>
    <ion-page>
        <ion-header class="gradient-header">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/tabs/home" :icon="arrowBackOutline"></ion-back-button>
                </ion-buttons>
                <ion-title>Settings</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="bg-gray-50">
            <div class="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <ion-list class="rounded-lg bg-white shadow-sm divide-y divide-gray-200">
                    <ion-item button @click="goToAccount" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="personOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">Account Settings</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>

                    <ion-item button @click="goToSecurity" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="lockClosedOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">Security & Privacy</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>

                    <ion-item button @click="goToNotifications" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="notificationsOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">Notifications</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>

                    <ion-item button @click="goToAppPreferences" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="colorPaletteOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">App Preferences</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>

                    <ion-item button @click="goToBlockchain" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="cubeOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">Blockchain Settings</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>

                    <ion-item button @click="goToLegal" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="documentTextOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">Legal & Support</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>

                    <ion-item button @click="goToDeveloper" class="px-4 py-4 hover:bg-gray-50 transition-colors duration-150 last:rounded-b-lg">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center">
                                <ion-icon :icon="codeSlashOutline" class="w-6 h-6 text-gray-400 mr-4"></ion-icon>
                                <ion-label class="text-base font-medium text-gray-900">Developer Options</ion-label>
                            </div>
                            <ion-icon :icon="arrowBackOutline" class="w-5 h-5 text-gray-400 rotate-180"></ion-icon>
                        </div>
                    </ion-item>
                </ion-list>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref ,defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonIcon
} from '@ionic/vue';
import {
    personOutline, lockClosedOutline, notificationsOutline, arrowBackOutline,
    colorPaletteOutline, cubeOutline, documentTextOutline, codeSlashOutline
} from 'ionicons/icons';
 
const router = useRouter();
const goToAccount = () => router.push('/settings/account');
const goToSecurity = () => router.push('/settings/security');
const goToNotifications = () => router.push('/settings/notifications');
const goToAppPreferences = () => router.push('/settings/app-preferences');
const goToBlockchain = () => router.push('/settings/blockchain');
const goToLegal = () => router.push('/settings/legal');
const goToDeveloper = () => router.push('/settings/developer');

</script>

<style scoped>
.gradient-header ion-toolbar {
    --background: var(--gradient-primary);
    --color: white;
}

/* Override Ionic default styles */
ion-item {
    --padding-start: 0;
    --inner-padding-end: 0;
    --background-hover: transparent;
}

ion-list {
    background: transparent;
}

ion-back-button {
    color: white;
}

/* Remove default Ionic item borders */
ion-item {
    --border-width: 0;
}
</style>