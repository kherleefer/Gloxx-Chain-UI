<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding login-bg">
      <div class="auth-container">
        <ion-card class="login-card">
          <ion-card-header class="card-header">
        
            <ion-card-title class="ion-text-center login-title">
              <GlxOutlineIcon />
              Welcome Back
            </ion-card-title>
            <ion-text class="login-subtitle ion-text-center">
              Please sign in to your account
            </ion-text>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="login">
              <ion-item class="login-item" lines="none">
                <ion-label position="floating" class="floating-label">Username</ion-label>
                <ion-input v-model="userName" type="text" required autocomplete="username"></ion-input>
              </ion-item>

              <ion-item class="login-item" lines="none">
                <ion-label position="floating" class="floating-label">Password</ion-label>
                <ion-input :type="showPassword ? 'text' : 'password'" v-model="password" required autocomplete="current-password"></ion-input>
                <ion-icon
                  :icon="showPassword ? eye : eyeOff"
                  slot="end"
                  @click="togglePasswordVisibility"
                  class="password-toggle"
                />
              </ion-item>

              <div class="login-options">
                <ion-checkbox v-model="rememberMe" class="remember-me"></ion-checkbox>
                <ion-label class="remember-label">Remember Me</ion-label>
                <ion-button fill="clear" size="small" class="forgot-btn app-primary" @click="forgotPassword">Forgot Password?</ion-button>
              </div>

              <ion-button expand="block" class="login-btn" :disabled="!isFormValid" type="submit">
                <ion-spinner v-if="isLoading" name="crescent"></ion-spinner>
                <span v-else>Login</span>
              </ion-button>

              <ion-text color="danger" v-if="errorMessage" class="error-message">{{ errorMessage }}</ion-text>
            </form>

            <div class="register-link">
              <ion-text>Don't have an account?</ion-text>
              <ion-button fill="clear" size="small" class="signup-btn app-primary" @click="goToRegister">Sign Up</ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
      <ForgotPasswordModal v-model:isOpen="isModalOpen" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCheckbox, IonIcon, IonSpinner } from "@ionic/vue";
import { eye, eyeOff } from "ionicons/icons";
import { loginAuth } from "./loginAuth";
import { useRouter } from "vue-router";
import ForgotPasswordModal from '@/components/ForgotPasswordModal.vue';
import GlxOutlineIcon from '@/components/GlxOutlineIcon.vue';

const router = useRouter();

const {
  userName, password, rememberMe, showPassword, errorMessage, goToRegister,
  forgotPassword, login, togglePasswordVisibility, isFormValid, isLoading, isModalOpen
} = loginAuth();
</script>

<style scoped>
.login-bg {
  --background: var(--ion-background-color);
  min-height: 100vh;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 24px 0 12px 0;
  background:var(--ion-card-background);
}

.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.login-logo svg {
  width: 48px;
  height: 48px;
  display: block;
  color: var(--ion-background-color);
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color : var(--ion-text-color);
}

.login-lock {
  font-size: 2.2rem;
  color: var(--ion-color-primary);
  margin-bottom: 2px;
}

.login-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  display: block;
}

.login-item {
  margin-bottom: 1.25rem;
  border-radius: 12px;
  background: var(--ion-background-color);
  --highlight-background: transparent;
  --background: transparent;
  box-shadow: none;
}

.floating-label {
  margin-bottom: 8px !important;
  padding-bottom: 6px !important;
  /* Add extra space below the label */
}

.password-toggle {
  cursor: pointer;
  font-size: 1.4rem;
  color: #6b7280;
  margin-right: 6px;
  transition: color 0.2s;
}
.password-toggle:hover {
  color: var(--ion-color-primary);
}

.login-options {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.remember-me {
  margin-right: 0.25rem;
}
.remember-label {
  font-size: 0.95rem;
  color: #6b7280;
  margin-right: auto;
}
.forgot-btn {
  margin-left: auto;
  font-size: 0.95rem;
  color: var(--ion-color-primary) !important;
  text-transform: none;
  font-weight: 500;
}

.login-btn {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  box-shadow: 0 2px 8px 0 rgba(56, 128, 255, 0.08);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1rem;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1rem;
}

.signup-btn {
  color: var(--ion-color-primary) !important;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  margin-left: 0.25rem;
}

.app-primary {
  color: var(--ion-color-primary) !important;
}
</style>