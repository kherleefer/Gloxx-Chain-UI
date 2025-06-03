<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Change Password</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- Username -->
      <ion-item>
        <ion-label position="floating">Username</ion-label>
        <ion-input v-model="userName" type="text" required></ion-input>
      </ion-item>

      <!-- New Password -->
      <ion-item>
        <ion-label position="floating">New Password</ion-label>
        <ion-input v-model="newPassword" type="password" required></ion-input>
      </ion-item>

      <!-- Confirm Password -->
      <ion-item>
        <ion-label position="floating">Confirm Password</ion-label>
        <ion-input v-model="confirmPassword" type="password" required></ion-input>
      </ion-item>

      <!-- Key -->
      <ion-item>
        <ion-label position="stacked">Key</ion-label>
        <ion-textarea
          v-model="key"
          autoGrow="true"
          placeholder="Enter your Private key here"
        ></ion-textarea>
      </ion-item>

      <!-- Submit Button -->
      <ion-button expand="block" :disabled="!isValid" @click="handleSubmit">
        <ion-spinner v-if="isLoading"></ion-spinner>
        <span v-else>Change Password</span>
      </ion-button>

      <!-- Feedback -->
      <ion-text color="danger" v-if="error" class="feedback-message">{{ error }}</ion-text>
      <ion-text color="success" v-if="success" class="feedback-message">{{ success }}</ion-text>

    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  IonModal, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonItem, IonLabel, IonInput, IonButtons,IonTextarea,
  IonText, IonSpinner
} from '@ionic/vue';
import api from '@/services/api';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['update:isOpen']);

const userName = ref('');
const key = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

const isValid = computed(() => {
  return (
    userName.value.trim().length > 3 &&
    key.value.trim().length > 10 &&
    newPassword.value.length >= 6 &&
    newPassword.value === confirmPassword.value
  );
});

const closeModal = () => {
  emit('update:isOpen', false);
  userName.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  key.value = '';
  error.value = '';
  success.value = '';
};

const handleSubmit = async () => {
  if (!isValid.value) return;
  
  isLoading.value = true;
  error.value = '';
  success.value = '';
  
  try {
    await api.post('/change-password', { 
    userName: userName.value,
    privateKey: key.value,
    newPassword: newPassword.value 
});
    success.value = 'Password changed successfully';
    setTimeout(closeModal, 2000);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to change password';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
ion-item {
  margin-bottom: 16px;
  --inner-padding-end: 0;
}

ion-textarea {
  --min-height: 100px;
}

ion-button {
  margin-top: 20px;
}

.feedback-message {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}
</style>