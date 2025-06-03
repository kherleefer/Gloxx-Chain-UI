<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding register-bg">
      <div class="auth-container">
        <ion-card class="register-card">
          <ion-card-header class="card-header">

            <ion-card-title class="ion-text-center register-title">
              <GlxOutlineIcon />
              Create Account
            </ion-card-title>
            <ion-text class="register-subtitle ion-text-center">
              Join us and start your journey!
            </ion-text>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="register">
              <ion-item class="register-item" lines="none">
                <ion-label position="floating" class="floating-label">First Name</ion-label>
                <ion-input v-model="fName" type="text" required autocomplete="given-name"></ion-input>
              </ion-item>

              <ion-item class="register-item" lines="none">
                <ion-label position="floating" class="floating-label">Last Name</ion-label>
                <ion-input v-model="lName" type="text" required autocomplete="family-name"></ion-input>
              </ion-item>

              <ion-item class="register-item" lines="none">
                <ion-label position="floating" class="floating-label">Username</ion-label>
                <ion-input v-model="userName" type="text" required autocomplete="username"></ion-input>
              </ion-item>

              <ion-item class="register-item" lines="none">
                <ion-label position="floating" class="floating-label">Password</ion-label>
                <ion-input :type="showPassword ? 'text' : 'password'" v-model="password" required
                  autocomplete="new-password"></ion-input>
                <ion-icon :icon="showPassword ? eye : eyeOff" slot="end" @click="togglePasswordVisibility"
                  class="password-toggle" />
              </ion-item>

              <ion-item class="register-item" lines="none">
                <ion-label position="floating" class="floating-label">Confirm Password</ion-label>
                <ion-input :type="showCPassword ? 'text' : 'password'" v-model="cPassword" required
                  autocomplete="new-password"></ion-input>
                <ion-icon :icon="showCPassword ? eye : eyeOff" slot="end" @click="toggleCPasswordVisibility"
                  class="password-toggle" />
              </ion-item>
              
              <span class="text-default -mt-2">Default Code: 
                <span class="policy-label underline "  @click="copyText(Code)">
                  {{ Code }} 
                </span> 
              </span> <br>

              <ion-item class="register-item" lines="none">
                <ion-label position="floating" class="floating-label">Referral Code</ion-label>
                <ion-input v-model="referralCode" type="text" required></ion-input>
              </ion-item>

              <div class="policy-row">
                <ion-checkbox v-model="acceptedPolicy" :aria-label="'Accept Privacy Policy & Terms'" />
                <span class="policy-label">
                  I agree to the
                  <a href="#" @click.prevent="showPolicyModal = true" class="policy-link">Privacy Policy</a>
                  &
                  <a href="#" @click.prevent="showPolicyModal = true" class="policy-link">Terms of Use</a>
                </span>
              </div>

              <ion-button expand="block" class="register-btn" :disabled="!isFormValid || !acceptedPolicy" type="submit">
                <ion-spinner v-if="isLoading"></ion-spinner>
                <span v-else>Sign Up</span>
              </ion-button>

              <ion-text color="danger" v-if="errorMessage" class="error-message">{{ errorMessage }}</ion-text>
            </form>

            <div class="register-link">
              <ion-text>Already have an account?</ion-text>
              <ion-button fill="clear" size="small" class="login-btn app-primary" @click="goToLogin">Login</ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
    <ion-alert
        :is-open="showAlert"
        header="Success!"
        :message="alertMessage || 'update successful'"
         :buttons="[{
          text: 'OK',
          role: 'confirm',
          handler: () => {
            showAlert = false;
          }
        }]"
      />

      <ion-modal :is-open="showPolicyModal" @did-dismiss="showPolicyModal = false">
        <div class="policy-modal-content">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Privacy Policy & Terms of Use</h2>
          <div class="policy-content overflow-y-auto max-h-[60vh] text-left px-4">
            <div class="space-y-6">
              <!-- Privacy Policy Section -->
              <section class="policy-section">
                <h3 class="text-xl font-semibold text-gray-700 mb-4">Privacy Policy</h3>
                <p class="text-gray-600 mb-2">Effective Date: January 1, 2024</p>
                <div class="space-y-4">
                  <!-- Data Collection -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">1. Data We Collect</h4>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Full Name</li>
                      <li>Email Address</li>
                      <li>Phone Number</li>
                      <li>Location</li>
                      <li>Username</li>
                    </ul>
                  </div>

                  <!-- Purpose of Data Collection -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">2. Purpose of Data Collection</h4>
                    <p class="text-gray-600">
                      Your data is collected solely for the following purposes:
                    </p>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Authentication and account verification</li>
                      <li>Compliance with regulatory and legal requirements</li>
                    </ul>
                  </div>

                  <!-- Legal Basis for Processing -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">3. Legal Basis for Processing</h4>
                    <p class="text-gray-600">
                      We process your personal data under the following lawful bases:
                    </p>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                      <li>
                        <strong>Consent:</strong> By registering, you give explicit consent to the processing of your
                        data.
                      </li>
                      <li>
                        <strong>Legal Obligation:</strong> We may be required to retain your data to comply with legal
                        obligations.
                      </li>
                      <li>
                        <strong>Legitimate Interest:</strong> For system security and to maintain regulatory compliance.
                      </li>
                    </ul>
                  </div>

                  <!-- Data Sharing -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">4. Data Sharing</h4>
                    <p class="text-gray-600">
                      Your personal data is shared only with our hosting provider,
                      Railway Hosting Service. This service provider:
                    </p>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Operates under strict confidentiality agreements</li>
                      <li>Is fully GDPR-compliant</li>
                      <li>Implements appropriate security measures to protect your data</li>
                    </ul>
                  </div>

                  <!-- Data Retention -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">5. Data Retention</h4>
                    <p class="text-gray-600">
                      Your personal data will be retained only as long as necessary for the purposes stated above and in
                      accordance with legal and regulatory requirements.
                    </p>
                  </div>

                  <!-- Your Rights Under GDPR -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">6. Your Rights Under GDPR</h4>
                    <p class="text-gray-600">
                      Under the GDPR, you have the right to:
                    </p>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Access the personal data we hold about you</li>
                      <li>Correct any inaccuracies in your personal data</li>
                      <li>Withdraw consent at any time</li>
                      <li>Request deletion of your data ("right to be forgotten")</li>
                      <li>Restrict or object to data processing</li>
                      <li>Data portability</li>
                    </ul>
                    <p class="text-gray-600 mt-2">
                      To exercise any of these rights, please contact us at: gloxx_chain@hotmail.com
                    </p>
                  </div>

                  <!-- Security -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">7. Security</h4>
                    <p class="text-gray-600">
                      We take data protection seriously and implement appropriate technical and organizational measures
                      to safeguard your personal information.
                    </p>
                  </div>
                </div>
              </section>

              <!-- Terms of Use Section -->
              <section class="policy-section mt-8">
                <h3 class="text-xl font-semibold text-gray-700 mb-4">Terms of Use</h3>
                <p class="text-gray-600 mb-2">Effective Date: January 1, 2024</p>
                <div class="space-y-4">
                  <!-- Eligibility -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">1. Eligibility</h4>
                    <p class="text-gray-600">
                      You must be at least 18 years old or the age of legal majority in your jurisdiction to use our
                      services.
                    </p>
                  </div>

                  <!-- Account Responsibility -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">2. Account Responsibility</h4>
                    <p class="text-gray-600">
                      You are responsible for maintaining the confidentiality of your account credentials and for all
                      activities that occur under your account.
                    </p>
                  </div>

                  <!-- Acceptable Use -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">3. Acceptable Use</h4>
                    <p class="text-gray-600">
                      You agree not to:
                    </p>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Use our service for unlawful or prohibited activities</li>
                      <li>Impersonate others or misrepresent your identity</li>
                      <li>Attempt to access restricted areas without authorization</li>
                    </ul>
                  </div>

                  <!-- Data Collection and Use -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">4. Data Collection and Use</h4>
                    <p class="text-gray-600">
                      By using our services, you consent to the collection and processing of your personal data as
                      outlined in our Privacy Policy.
                    </p>
                  </div>

                  <!-- Limitation of Liability -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">5. Limitation of Liability</h4>
                    <p class="text-gray-600">
                      To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, or
                      consequential damages arising out of or related to your use of the services.
                    </p>
                  </div>

                  <!-- Termination -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">6. Termination</h4>
                    <p class="text-gray-600">
                      We reserve the right to suspend or terminate your account if you violate these terms or any
                      applicable laws.
                    </p>
                  </div>

                  <!-- Changes to Terms -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">7. Changes to Terms</h4>
                    <p class="text-gray-600">
                      We may update these Terms of Use from time to time.
                      Continued use of our service after any changes constitutes your acceptance of the new terms.
                    </p>
                  </div>

                  <!-- Contact -->
                  <div>
                    <h4 class="text-lg font-medium text-gray-700 mb-2">8. Contact</h4>
                    <p class="text-gray-600">
                      For questions about these Terms or the Privacy Policy, contact us at: gloxx_chain@hotmail.com
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="mt-6 border-t border-gray-200 pt-4">
            <ion-button expand="block" class="font-medium rounded-lg" @click="showPolicyModal = false">
              I Understand
            </ion-button>
          </div>
        </div>
      </ion-modal>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonContent, IonCard, IonCardHeader,IonAlert, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonIcon, IonSpinner, IonCheckbox, IonModal } from "@ionic/vue";
import { eye, eyeOff } from "ionicons/icons";
import { registerFunc } from './registerFunc';
import GlxOutlineIcon from '@/components/GlxOutlineIcon.vue';



const acceptedPolicy = ref(false);
const showPolicyModal = ref(false);
const {
  fName, lName, userName, password,
  cPassword, referralCode, showPassword, showCPassword, register,
  toggleCPasswordVisibility, togglePasswordVisibility,
  errorMessage, isFormValid, goToLogin, isLoading, Code, copyText, showAlert, alertMessage
} = registerFunc();
</script>

<style scoped>
.register-bg {
  --background: var(--ion-background-color);
  min-height: 100vh;
}

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}

.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  padding: 24px 0 12px 0;
  background: var(--ion-card-background);
}

.register-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.register-logo svg {
  width: 48px;
  height: 48px;
  display: block;
  color: var(--ion-background-color);
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--ion-text-color);
}

.register-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  display: block;
}

.register-item {
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

.register-btn {
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

.login-btn {
  color: var(--ion-color-primary) !important;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  margin-left: 0.25rem;
}

.app-primary {
  color: var(--ion-color-primary) !important;
}

.policy-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  font-size: 0.97rem;
  gap: 0.5rem;
}

.policy-label {
  color: #6b7280;
  margin-left: 0.5rem;
  user-select: none;
}

.policy-link {
  color: var(--ion-color-primary);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
  margin: 0 2px;
}

.policy-modal-content {
  @apply max-w-2xl mx-auto bg-white rounded-2xl shadow-xl;
  padding: 2rem 1.5rem;
}

.policy-content {
  @apply text-base leading-relaxed;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.policy-content h3 {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

.policy-content h4 {
  @apply text-lg font-medium text-gray-700 mb-2;
}

.policy-content p {
  @apply text-gray-600 mb-4;
}

.policy-content ul {
  @apply list-disc pl-5 text-gray-600 space-y-1 mb-4;
}

.policy-content li {
  @apply text-gray-600;
}

.policy-section {
  @apply pb-6 border-b border-gray-100 last:border-0;
}
</style>