<template>
  <ion-page >
    <headerContent />

    <ion-content class="ion-padding" id="main-content" :fullscreen="true" :class="{'blur-backgroud':isLoading}">
      
        <!-- Mining Power Row -->
        <ion-card class="b-all">
          <ion-card-header>
            <ion-card-title class="text-light text-bold space-between text-sm sm:text-base md:text-lg" >
              
              <span><ion-icon :icon="hardwareChipOutline" class="mining-icon"></ion-icon> Mining Power </span> 
              
                <span >{{ formattedMiningPower.total }} /hr </span>
              
            </ion-card-title>
          </ion-card-header>
          <ion-card-content>
           
            <div class="mining-stats">
              <div class="glx-icon-container sessiontg">
                <span class="text-sec mobile-text">{{ sessionBal.toFixed(4) }}</span>
                <div class="glx-outer">
                  <img src="@/asset/image/Gloss outer.png" alt="GLX-outer" class="glx-img-outer" />
                  <div class="glx-inner">
                    <img src="@/asset/image/Gloss inner.png" alt="GLX-inner" class="glx-img-inner" />
                  </div>
                </div>
               
              </div>
              <ion-button 
                :disabled="!isSessionComplete || parseFloat(sessionBal.toString()) <= 0" 
                @click="claimMiningReward" 
                class="claim-button"
              >
                <ion-spinner v-if="isClaiming" name="crescent"></ion-spinner>
                <span v-else>{{ formatRemainingTime() }}</span>
                
              </ion-button>
              <ion-progress-bar :value="progress"></ion-progress-bar>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Staking Row -->
        <div class="staking-row ">
          <ion-card class="bt-left ">
            <ion-card-header>
              <ion-card-title class="text-light text-bold" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="text-sm sm:text-base md:text-lg" style="display: flex; gap: 8px; align-items: center;">
                  <ion-icon :icon="walletOutline"></ion-icon>
                  <span>Staked</span>
                </div>
                
              </ion-card-title>
            </ion-card-header>
            <ion-card-content >
              <div class="space-between">
              <h3 class="text-bold text-pri">Glx  </h3>
              <div class="staked-amount-container">
                <h3 class="text-bold text-pri"> {{ stakedAmount }}</h3>
                <ion-button 
                  fill="clear" 
                  size="small" 
                  class="unstake-icon"
                  @click="openUnstakeModal"
                >
                  <ion-icon :icon="arrowDownCircleOutline"></ion-icon>
                </ion-button>
              </div>
              </div>
            </ion-card-content>
          </ion-card>

          <ion-card class="bt-right">
            <ion-card-header>
              <ion-card-title class="text-light text-bold" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="text-sm sm:text-base md:text-lg" style="display: flex; gap: 8px; align-items: center;">
                  <ion-icon :icon="cashOutline"></ion-icon>
                  <span>Balance</span>
                </div>
                
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <div class="space-between">
                <h3 class="text-bold text-pri">Glx</h3>
                <div class="balance-container">
                  <h3 class="text-bold text-pri">{{ balance }}</h3>
                  <ion-button 
                    fill="clear" 
                    size="small" 
                    class="withdraw-icon"
                    @click="openWithdrawModal"
                  >
                    <ion-icon :icon="arrowUpCircleOutline"></ion-icon>
                  </ion-button>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Staking Section with Chart -->
        <ion-card class="b-all">
          <ion-card-header  >
            <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">Staking</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="staking-container">
              <!-- Staking Input -->
              <div class=" text-sm sm:text-base md:text-lg">
                <div class="stake-amount">
                  <br>
                  <ion-label>Stake Amount:</ion-label>
                  <ion-input 
                    type="number" 
                    v-model="stakeAmount" 
                    min="0"
                    :max="balance"
                    placeholder="Enter GLX amount"
                    class="custom-input"
                    :class="{ 'error': !canStake && stakeAmount }"
                  ></ion-input>
                </div>
                
                <div class="stake-duration">
                  <ion-label>Duration:</ion-label>
                  <ion-select 
                    v-model="stakeDuration" 
                    placeholder="Select duration"
                    interface="popover"
                    class="duration-select"
                    @ionChange="(e: CustomEvent) => stakeDuration = Number(e.detail.value)"
                  required>
                    <ion-select-option :value="3">3 Months (0.5%)</ion-select-option>
                    <ion-select-option :value="6">6 Months (1.2%)</ion-select-option>
                    <ion-select-option :value="9">9 Months (3%)</ion-select-option>
                    <ion-select-option :value="12">1 Year (5%)</ion-select-option>
                    <ion-select-option :value="18">1.5 Years (8%)</ion-select-option>
                    <ion-select-option :value="24">2 Years (12%)</ion-select-option>
                    <ion-select-option :value="36">3 Years (18%)</ion-select-option>
                  </ion-select>
                </div>
              </div>
              
              <ion-button 
                expand="block" 
                :disabled="!canStake" 
                @click="handleStake" 
                class="stake-button"
              >
                <ion-spinner v-if="isStaking"></ion-spinner>
                <span v-else class="text-bold">
                  {{ !stakeAmount ? 'Enter amount to stake' : 
                     !canStake ? 'Insufficient balance' : 
                     'Stake GLX' }}
                </span>
              </ion-button>

              <!-- Mining Power Details -->
              <div class="mining-details">
                <span class="text-bold text-pri">Base Rate: {{ formattedMiningPower.base }} GLX/hr</span>
                <span class="text-bold text-pri" v-if="formattedMiningPower.stakeBonusValue > 0">
                  Stake Bonus: +{{ formattedMiningPower.stakeBonus }} GLX/hr
                  <span class="bonus-rate text-bold text-pri">(+0.0003 GLX/hr per GLX staked)</span>
                </span>
              </div>

              <!-- Active Stakes -->
              <div v-if="activeStakes.length > 0" class="active-stakes">
                <h4 class="text-bold text-pri">Active Stakes</h4>
                <ion-list>
                  <ion-item v-for="stake in activeStakes" :key="stake.stake_id">
                    <ion-label>
                      <h3 class="text-bold text-pri">{{ stake.amount }} GLX</h3>
                      <p class="text-bold text-pri">Staked on {{ formatDate(stake.stake_date) }}</p>
                    </ion-label>
                    <ion-button slot="end" fill="clear" @click="handleUnstake(stake.stake_id)">
                      Unstake
                    </ion-button>
                  </ion-item>
                </ion-list>
              </div>

              <!-- User staking & Balance withdrawal history  -->
              
            </div>
          </ion-card-content>
        </ion-card>
                   
        <!-- User Growth Stats and Chart -->
        <ChartComponent/>
      
      
    </ion-content>
    
    <!-- Add Unstake Modal -->
    <ion-modal 
      :is-open="showUnstakeModal" 
      :breakpoints="[0, 0.25, 0.5]" 
      :initial-breakpoint="0.25"
      @didDismiss="showUnstakeModal = false"
    >
      <ion-content class="ion-padding">
        <div class="unstake-modal-content">
          <h3 class="text-bold">Unstake GLX</h3>
          <div class="unstake-input-container">
            <ion-item>
              <ion-label position="floating">Amount to Unstake</ion-label>
              <ion-input 
                type="number" 
                v-model="unstakeAmount" 
                :max="parseFloat(stakedAmount)"
                class="custom-input"
                disabled
              ></ion-input>
            </ion-item>
            <div class="available-stake">
              Staked: {{ stakedAmount }} GLX
            </div>
          </div>
          <ion-button 
            expand="block" 
            :disabled="!canUnstake" 
            @click="handleUnstakeAmount"
            class="unstake-button"
          >
            <ion-spinner v-if="isUnstaking"></ion-spinner>
            <span v-else>Unstake GLX</span>
          </ion-button>
        </div>
        <div class="withdraw-notice">
              <ion-text color="medium">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
                No Staked Glx is matured
              </ion-text>
            </div>
      </ion-content>
    </ion-modal>

    <!-- Add Withdraw Modal -->
    <ion-modal 
      :is-open="showWithdrawModal" 
      :breakpoints="[0, 0.25, 0.5]" 
      :initial-breakpoint="0.25"
      @didDismiss="showWithdrawModal = false"
    >
      <ion-content class="ion-padding">
        <div class="withdraw-modal-content">
          <h3 class="text-bold">Withdraw GLX</h3>
          <div class="withdraw-input-container">
            <ion-item>
              <ion-label position="floating">Amount to Withdraw</ion-label>
              <ion-input 
                type="number" 
                disabled
                placeholder="Withdrawals not available yet"
                class="custom-input"
              ></ion-input>
            </ion-item>
            <div class="available-balance">
              Available: {{ balance }} GLX
            </div>
            <div class="withdraw-notice">
              <ion-text color="medium">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
                Withdrawals will be enabled in future updates
              </ion-text>
            </div>
          </div>
          <ion-button 
            expand="block" 
            disabled
            class="withdraw-button"
          >
            <span>Withdraw GLX</span>
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

  </ion-page>
</template>

<script setup lang="ts">
import { 
    IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonSelect, IonTitle,
    IonCardContent, IonProgressBar, IonButton, IonIcon,IonModal, IonSelectOption,
    IonSpinner, IonItem, IonLabel, IonInput, IonList, IonText
} from '@ionic/vue';
import { hardwareChipOutline, walletOutline, cashOutline, arrowDownCircleOutline, arrowUpCircleOutline, informationCircleOutline } from 'ionicons/icons';
import headerContent from '@/components/headerContent.vue';
import ChartComponent from '@/components/ChartComponent.vue'; 
import loader from "@/components/loader.vue";
import { homeFunc } from "@/viewFunc/homeFunc";
import "@/asset/css/homePage.css";         

const { 
    miningPower, progress, stakedAmount, 
    balance, sessionBal, startTime, isSessionComplete, 
    updateSessionBalance, claimMiningReward,
    formattedMiningPower, isLoading, stakeAmount, 
    isStaking, activeStakes, canStake, handleStake, 
    handleUnstake, formatDate, formatRemainingTime,
    handleUnstakeAmount, unstakeAmount, isClaiming,
    canUnstake, isUnstaking, showUnstakeModal, 
    openUnstakeModal, showWithdrawModal, 
    openWithdrawModal, stakeDuration
} = homeFunc();

</script>

