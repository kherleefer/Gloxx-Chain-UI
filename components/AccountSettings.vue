<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/settings"></ion-back-button>
                </ion-buttons>
                <ion-title>Account Settings</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <!-- Security Key Card -->
            <ion-card class="b-all">
                <ion-card-header>
                    <ion-card-title class="text-bold">Security Key</ion-card-title>
                         <ion-text class="key-text">{{ Personalkey }}</ion-text>
                        <ion-button fill="clear" @click="copyText(Personalkey )">
                            <ion-icon :icon="copyOutline" slot="icon-only"></ion-icon>
                        </ion-button>
                     <ion-note color="warning">Keep this key safe. You'll need it to change your password.</ion-note>
                </ion-card-header>
            </ion-card>

            <!-- Profile Information Form -->
            <ion-card class="b-all">
                <ion-card-header>
                    <ion-card-title class="text-bold">Profile Information</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <form @submit.prevent="updateProfile">
                        <ion-list>
                            <ion-item>
                                <ion-label position="floating">First Name</ion-label>
                                <ion-input v-model="profile.firstName" type="text"></ion-input>
                            </ion-item>
                            
                            <ion-item>
                                <ion-label position="floating">Last Name</ion-label>
                                <ion-input v-model="profile.lastName" type="text"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="floating">Phone Number</ion-label>
                                <ion-input v-model="profile.phoneNum" type="tel"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label position="floating">Country</ion-label>
                                <ion-input v-model="profile.location" type="text"></ion-input>
                            </ion-item>
                        </ion-list>

                        <div class="ion-padding">
                            <ion-button 
                                expand="block" 
                                type="submit" 
                                :disabled="loading || !hasChanges"
                            >
                                <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                                <span v-else>Save Changes</span>
                            </ion-button>
                        </div>
                    </form>
                </ion-card-content>
            </ion-card>

            <!-- Password Change Section -->
            <ion-card class="b-all">
                <ion-card-header>
                    <ion-card-title class="text-bold">Change Password</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-list>
                        <ion-item>
                            <ion-label position="floating">New Password</ion-label>
                            <ion-input 
                                v-model="passwordForm.password" 
                                type="password"
                                autocomplete="new-password"
                            ></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating">Confirm Password</ion-label>
                            <ion-input 
                                v-model="passwordForm.confirmPassword" 
                                type="password"
                                autocomplete="new-password"
                            ></ion-input>
                        </ion-item>
                    </ion-list>

                    <div class="ion-padding">
                        <ion-button 
                            expand="block" 
                            @click="updatePassword"
                            :disabled="loading || !canUpdatePassword"
                            color="secondary"
                        >
                            <ion-spinner v-if="loading" name="crescent"></ion-spinner>
                            <span v-else>Update Password</span>
                        </ion-button>
                    </div>
                </ion-card-content>
            </ion-card>
        </ion-content>

        <ion-toast
            :is-open="toast.isOpen"
            :message="toast.message"
            :color="toast.color"
            :duration="3000"
            @didDismiss="toast.isOpen = false"
        ></ion-toast>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonList, IonItem, IonLabel, IonInput, IonButton, IonToast,
    IonSpinner, IonIcon, IonNote, IonText, IonCardContent
} from '@ionic/vue';
import { copyOutline } from 'ionicons/icons';
import api from '@/services/api';
import { PreferencesService } from '@/services/preferencesService';

const profile = ref({
    firstName: '',
    lastName: '',
    phoneNum: '',
    location: '',
});

const MainProfile = ref({});
const Personalkey = ref('');
const loading = ref(false);
const toast = ref({ 
    isOpen: false, 
    message: '', 
    color: 'success' 
});

const passwordForm = ref({
    password: '',
    confirmPassword: '',
});

const hasChanges = computed(() => {
    return JSON.stringify(profile.value) !== JSON.stringify(originalProfile.value);
});

const canUpdatePassword = computed(() => {
    return passwordForm.value.password && 
           passwordForm.value.password === passwordForm.value.confirmPassword &&
           passwordForm.value.password.length >= 6;
});

const showToast = (message: string, color = 'success') => {
    toast.value = {
        isOpen: true,
        message,
        color
    };
};

const fetchProfile = async () => {
    try {
        const userId = await PreferencesService.get('userId');
        if (!userId) {
            throw new Error('User ID not found');
        }

        const response = await api.post('/profile', {
            userId: parseInt(userId)
        });

        profile.value = {
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phoneNum: response.data.phoneNum,
            location: response.data.location,
        };
        
        mainProfile.value = { ...profile.value };
        Personalkey.value = response.data.key;
    } catch (error) {
        showToast('Failed to load profile', 'danger');
    }
};

const updateProfile = async () => {
    loading.value = true;
    try {
        const userId = await PreferencesService.get('userId');
        await api.post('/profile_updates', {
            userId: parseInt(userId),
            firstName: profile.value.firstName,
            lastName: profile.value.lastName,
            PhoneNum: profile.value.phoneNum,
            location: profile.value.location
        });

        mainProfile.value = { ...profile.value };
        showToast('Profile updated successfully');
    } catch (error) {
        showToast('Failed to update profile', 'danger');
    } finally {
        loading.value = false;
    }
};

const updatePassword = async () => {
    if (!canUpdatePassword.value) return;
    
    loading.value = true;
    try {
        const userId = await PreferencesService.get('userId');
        await api.post('/profile_update', {
            userId: parseInt(userId),
            password: passwordForm.value.password,
            lKey: key.value
        });

        passwordForm.value = {
            password: '',
            confirmPassword: ''
        };
        showToast('Password updated successfully');
    } catch (error) {
        showToast('Failed to update password', 'danger');
    } finally {
        loading.value = false;
    }
};

const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Key copied to clipboard');
    } catch (err) {
        showToast('Failed to copy key', 'danger');
    }
};

onMounted(fetchProfile);
</script>

<style scoped>
.key-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 0;
    background: var(--ion-color-light);
    padding: 8px;
    border-radius: 8px;
}

.key-text {
    font-family: monospace;
    font-size: 1.1em;
    letter-spacing: 1px;
}

ion-card {
    margin: 16px 0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

ion-card-header {
    padding: 16px;
}

ion-card-title {
    font-size: 1.2em;
    font-weight: 600;
}

ion-item {
    --padding-start: 0;
    --inner-padding-end: 0;
    margin-bottom: 8px;
}

ion-note {
    display: block;
    margin-top: 8px;
    font-size: 0.9em;
}

.ion-padding {
    padding: 16px;
}

ion-button {
    margin: 16px 0;
    height: 48px;
}

ion-spinner {
    margin-right: 8px;
}
</style>
