<template>
  <ion-page>
    <headerContent />

    <ion-content id="main-content" :fullscreen="true">
      

      <div class="profile-container">
        <div class="avatar-container" @click="openImageModal">
          <ion-avatar class="profile-avatar">
            <img :src="profileImage" alt="Profile picture" />
          </ion-avatar>
          <div class="avatar-overlay">
            <ion-icon :icon="camera"></ion-icon>
          </div>
        </div>


        <ion-card class="b-all">
          <ion-card-header class="card-header">
            <ion-card-title>{{ fullName }}</ion-card-title>
            <ion-card-subtitle @click="copyText(userName)">@{{ userName }}</ion-card-subtitle>
          </ion-card-header>



          <ion-card-content>
            <ion-list>
              <ion-item button @click="openFieldModal('firstName', firstName)">
                <ion-label>
                  <h3>First Name</h3>
                  <p>{{ firstName || 'Not set' }}</p>
                </ion-label>
                <ion-icon :icon="pencil" slot="end"></ion-icon>
              </ion-item>

              <ion-item button @click="openFieldModal('lastName', lastName)">
                <ion-label>
                  <h3>Last Name</h3>
                  <p>{{ lastName || 'Not set' }}</p>
                </ion-label>
                <ion-icon :icon="pencil" slot="end"></ion-icon>
              </ion-item>

              <ion-item button @click="openFieldModal('phone', phoneNum)">
                <ion-label>
                  <h3>Phone</h3>
                  <p>{{ phoneNum || 'Not set' }}</p>
                </ion-label>
                <ion-icon :icon="pencil" slot="end"></ion-icon>
              </ion-item>

              <ion-item button @click="openFieldModal('location', country)">
                <ion-label>
                  <h3>Location</h3>
                  <p>{{ country || 'Not set' }}</p>
                </ion-label>
                <ion-icon :icon="pencil" slot="end"></ion-icon>
              </ion-item>

              <ion-item button @click="openFieldModal('password', 'Password')">
                <ion-label>
                  <h3>Change Password</h3>
                  <p>******</p>
                </ion-label>
                <ion-icon :icon="pencil" slot="end"></ion-icon>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>


        
        <!-- Statistics Row -->
        <ion-card class="b-all">
          <ion-card-header class= "card-header">
            <ion-card-title>Statistics</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <div class="stat-item">
                    <h3>{{ nodes }}</h3>
                    <p>Nodes</p>
                  </div>
                </ion-col>
                <ion-col>
                  <div class="stat-item">
                    <h3>{{ taskes }}</h3>
                    <p>Tasks</p>
                  </div>
                </ion-col>
                <ion-col>
                  <div class="stat-item">
                    <h3>{{ referrals }}</h3>
                    <p>Referrals</p>
                  </div>
                </ion-col>
              </ion-row>
            </ion-grid>
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
      <ion-alert
        :is-open="showError"
        header="Error"
        :message= "errorMessage "
         :buttons="[{
          text: 'OK',
          role: 'confirm',
          handler: () => {
            showError = false;
          }
        }]"
      />
    
    <!-- Image Upload Modal -->
    <ion-modal :is-open="isImageModalOpen" @didDismiss="closeImageModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Update Profile Picture</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeImageModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list>
          <ion-item button  @click="uploadFile">
            <ion-icon slot="start" :icon="cloudUpload"></ion-icon>
            <ion-label>Select New Profile</ion-label>
          </ion-item>
          <ion-item button :disabled="!file" @click="uploadImage">
            <ion-icon slot="end" :icon="cloudUpload"></ion-icon>
            
            <ion-label>
              <ion-spinner v-if="isloading"></ion-spinner>
              <span v-else>upload New Profile</span>
            </ion-label>
          </ion-item>
          <ion-item button @click="removeImage" color="danger">
            <ion-icon slot="start" :icon="trash"></ion-icon>
            <ion-label>Remove Current Image</ion-label>
          </ion-item>
        </ion-list>
        <input type="file" ref="fileInput" accept="image/*" style="display: none; z-index: 9999" @change="handleFileChange" />
      </ion-content>
    </ion-modal>

    <!-- Field Edit Modal -->
    <ion-modal :is-open="!!activeEditModal" @didDismiss="closeFieldModal" class="field-edit-modal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Edit {{ activeEditModal }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeFieldModal">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <form @submit.prevent="saveFieldEdit">
          <ion-item>
            <ion-label position="stacked">{{ activeEditModal }}</ion-label>
            <ion-input v-model="editValue" :type="activeEditModal === 'password' ? 'password' : 'text'"
              :placeholder="`Enter ${activeEditModal}`" required></ion-input>
          </ion-item>

          <ion-item v-if="activeEditModal === 'password'">
            <ion-label position="stacked">Confirm Password</ion-label>
            <ion-input v-model="cPassword" type="password" placeholder="Confirm password" required></ion-input>

            <ion-label position="stacked">Key</ion-label>
            <ion-input v-model="lKey" type="text" placeholder="Enter your key" required></ion-input>
          </ion-item>

          <ion-button expand="block" type="submit" class="ion-margin-top" :disabled="isloading">
            <ion-spinner v-if="isloading"></ion-spinner>
            <span v-else>Save Changes</span>
          </ion-button>
        </form>
      </ion-content>
    </ion-modal>


  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonContent, IonToolbar, IonTitle, IonAvatar,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonAlert, IonGrid, IonRow, IonCol,
  IonButton, IonButtons, IonModal, IonInput, IonIcon, IonSpinner, IonHeader 
} from '@ionic/vue';
import { pencil, camera, cloudUpload, trash } from 'ionicons/icons';
import headerContent from '@/components/headerContent.vue';
import { profileFunc } from "@/viewFunc/profileFunc";


const {
  fullName, userName, country, phoneNum, profileImage, referrals, taskes, nodes,
  isloading, copyText, alertMessage,
  firstName, lastName, cPassword,
  activeEditModal, editValue, openFieldModal, closeFieldModal,
  saveFieldEdit, lKey, isImageModalOpen, openImageModal, fileInput, 
  closeImageModal, uploadImage, removeImage, handleFileChange, uploadFile, file, showAlert, showError, errorMessage

} = profileFunc();


</script>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  margin: 0;
  font-size: 1.4em;
  font-weight: bold;
  color: var(--ion-color-primary);
}

.stat-item p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: var(--ion-color-medium);
}

.edit-btn {
  --border-radius: 50px;
  margin-right: 16px;
  --background: var(--gradient-primary);
  --background-hover: var(--gradient-primary-hover);
  --ripple-color: rgba(255, 255, 255, 0.2);
}

ion-modal {
  --height: 50%;
  --border-radius: 16px;
}

.avatar-container {
  position: relative;
  width: fit-content;
  margin: 0 auto 20px;
  cursor: pointer;
}

.avatar-container::after {
  content: '↑';
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--ion-color-medium);
  font-size: 20px;
  animation: bounce 1s infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}



.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ion-background-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-overlay ion-icon {
  font-size: 24px;
  color: var(--ion-background-color);
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.field-edit-modal {
  --height: 33%;
  --border-radius: 16px 16px 0 0;
}

ion-item button {
  --ripple-color: var(--ion-color-primary, #3880ff);
}

ion-item h3 {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
}

ion-item p {
  color: var(--ion-color-medium);
  font-size: 0.875rem;
}

ion-icon {
  color: var(--ion-color-medium);
}

.profile-field {
  margin-bottom: 16px;
}

.profile-field-label {
  font-size: 0.875rem;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}

.profile-field-value {
  font-size: 1rem;
  color: var(--ion-color-dark);
}
</style>
