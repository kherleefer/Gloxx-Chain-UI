<template>
  <ion-page>
    <headerContent />

    <ion-content class="ion-padding">

      <!-- Incomplete Tasks Section -->
      <h2>Available Tasks</h2>
      <div v-if="incompleteTasks.length > 0">
        <ion-card class="b-all" v-for="task in incompleteTasks" :key="task.task_id">
          <ion-card-header class="card-header">
            <ion-card-title>
              <ion-icon :icon="listOutline" class="icon-left"></ion-icon>
              {{ task.task_title }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ task.task_desc }}</p>
            <p>
              <strong>
                <ion-icon :icon="walletOutline" class="icon-left"></ion-icon>
                Reward:
              </strong>
              {{ task.task_point }} GLX
            </p>

            <div class="task-buttons">
              <ion-button v-if="!hasVisitedTask(task.task_id)" expand="block" color="primary"
                :disabled="getTaskStatus(task.task_id) || isLoading" @click="goToTask(task)" class="task-button">
                <ion-icon :icon="openOutline" class="icon-left"></ion-icon>
                <span>Go to Task</span>
              </ion-button>

              <ion-button v-else="hasVisitedTask(task.task_id) && !isTaskCompleted(task.task_id)" expand="block"
                color="success" :disabled="isLoading" @click="claimReward(task)" class="task-button">
                <ion-icon :icon="trophyOutline" class="icon-left"></ion-icon>
                <ion-spinner v-if="isLoading"></ion-spinner>
                <span v-else>Claim Reward</span>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>
      </div>
      <ion-text v-else>
        <ion-spinner v-if="isLoading"></ion-spinner>
        <span v-else>No available tasks</span>

      </ion-text>

      <!-- Completed Tasks Section -->
      <h2>Completed Tasks</h2>
      <div v-if="completedTasks.length > 0">
        <ion-card class="b-all completed-task" v-for="task in completedTasks" :key="task.task_id">
          <ion-card-header class="card-header">
            <ion-card-title>
              <ion-icon :icon="checkmarkCircleOutline" class="icon-left"></ion-icon>
              {{ task.task_title }}
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ task.task_desc }}</p>
            <p>
              <strong>
                <ion-icon :icon="walletOutline" class="icon-left"></ion-icon>
                Earned:
              </strong>
              {{ task.task_point }} GLX
            </p>
          </ion-card-content>
        </ion-card>
      </div>
      <ion-text v-else>
        <ion-spinner v-if="isLoading"></ion-spinner>
        <span v-else>No completed tasks yet.</span>

      </ion-text>
      <!-- Move alerts outside the card loop -->
      <ion-alert :is-open="showAlert" header="Task Completed!" :message="`You earned ${completedTaskReward} GLX.`"
        :buttons="[{
          text: 'OK',
          role: 'confirm',
          handler: () => {
            showAlert = false;
          }
        }]" />
      <ion-alert :is-open="showError" header="Error" :message="errorMessage" :buttons="[{
        text: 'OK',
        role: 'confirm',
        handler: () => {
          showError = false;
        }
      }]" />
    </ion-content>
    <bannerAd />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAlert,
  IonText,
  IonIcon,
  IonSpinner
} from "@ionic/vue";
import { openOutline, listOutline, walletOutline, trophyOutline, checkmarkCircleOutline } from 'ionicons/icons';
import headerContent from '@/components/headerContent.vue';
import { taskFunc } from '@/viewFunc/taskFunc';
import bannerAd from '@/components/bannerAd.vue';

const {
  completeTask, incompleteTasks, completedTasks, isTaskCompleted, isLoading, showAlert,
  completedTaskReward, showError, errorMessage, goToTask, claimReward, hasVisitedTask,
  handleTaskAction, getTaskStatus
} = taskFunc();
</script>

<style scoped>
ion-card {
  text-align: center;
}

.icon-left {
  margin-right: 8px;
  vertical-align: middle;
}

.task-button {
  margin-bottom: 8px;
}

.task-button:last-child {
  margin-bottom: 0;
}

.completed-task {
  opacity: 0.8;
  background-color: #f5f5f5;
}

.task-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>