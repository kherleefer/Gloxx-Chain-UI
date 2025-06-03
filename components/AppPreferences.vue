<template>
    <ion-page>
        <ion-header class="card-header">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/settings"></ion-back-button>
                </ion-buttons>
                <ion-title>App Preferences</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list>
                <ion-item>
                    <ion-label>Theme</ion-label>
                    <ion-select 
                    v-model="theme"
                    interface="popover"
                    >
			<ion-select-option value="">Select Theme</ion-select-option>
                        <ion-select-option value="light">Light</ion-select-option>
                        <ion-select-option value="dark">Dark</ion-select-option>
                        <ion-select-option value="auto">Auto</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label>Language</ion-label>
                    <ion-select 
                    v-model="language"
                    interface="popover"
                    >
                        <ion-select-option value="en">English</ion-select-option>
                        <ion-select-option value="es">Spanish</ion-select-option>
                        <!-- Add more languages -->
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label>Currency</ion-label>
                    <ion-select 
                    v-model="currency"
                    interface="popover"
                    >
			<ion-select-option value="">Change Currency</ion-select-option>
                        <ion-select-option value="USD">USD</ion-select-option>
                        <ion-select-option value="EUR">EUR</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
            <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="2000"
                @didDismiss="toast.isOpen = false">
            </ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonToast
} from '@ionic/vue';
import { PreferencesService } from '@/services/preferencesService';
import { importCss } from '@/main'; // this is the Theme Switch initiator

const theme = ref<string>('light'); 
const language = ref<string>('en');
const currency = ref<string>('USD');
const toast = ref({ isOpen: false, message: '' });

const fetchPreferences = async () => {
    try {
        theme.value = await PreferencesService.get('theme') || 'light';
        console.log('theme fetched', theme.value);
        language.value = await PreferencesService.get('language') || 'en';
        currency.value = await PreferencesService.get('currency') || 'USD';
    } catch (error) {
        toast.value = { isOpen: true, message: 'Failed to load preferences' };
    }
};


watch(theme, async (newTheme, oldTheme) => {
    console.log('onThemeChange triggered not HTML', { newTheme, oldTheme });
    try {
        await PreferencesService.set('theme', newTheme);
        await importCss();
        toast.value = { isOpen: true, message: 'Theme updated' };

    } catch (error) {
        console.error('error saving theme', error);
        toast.value = { isOpen: true, message: 'Failed to update Theme' };
    }


});

watch(language, async (newLanguage, oldLanguage) => {
    console.log('lang comitted', { newLanguage, oldLanguage });
    try {
        await PreferencesService.set('language', newLanguage);
        toast.value = { isOpen: true, message: 'New Language Set' };
    } catch (error) {
        toast.value = { isOpen: true, message: 'Failed to update Language' };
    }
});

watch(currency, async (newCurrency, oldCurrency) => {
    console.log('Currency committed', { newCurrency, oldCurrency });
    try {
        await PreferencesService.set('currency', newCurrency);
        toast.value = { isOpen: true, message: 'Currency updated' };
    } catch (error) {
        toast.value = { isOpen: true, message: 'Failed to update Currency' };
    }
});

onMounted(async () => {
    await fetchPreferences();
    await importCss();
});
</script>