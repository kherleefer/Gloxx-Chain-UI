
<template>
  <ion-page>
    <headerContent />

    <ion-content class="ion-padding">
      <div class="wallet-container  ">
        <!--temporary section-->
        <div class="content-outer ">
          <img src="@/asset\image\Gloxx-logo-lg.png" alt="Construction" class="content-img-outer" />
          <br>
          <span class="text-bold text-inherit text-success"> Coming Soon</span>

        </div>
        <!-- main wallet section-->
        <ion-card class="balance-card">
          <ion-card-content>
            <h1 class="text-pri">${{ tokensVal }} <span class="glx"></span></h1>
            <p class="wallet-address text-bold">{{ walletAddress }}</p>

            <!-- Action Icons -->
            <div class="actions">
              <ion-button class=" send" @click="openSendModal">
                <ion-icon :icon="paperPlaneOutline"></ion-icon>
              </ion-button>
              <ion-button class=" receive" @click="openReceiveModal">
                <ion-icon :icon="qrCodeOutline"></ion-icon>
              </ion-button>
              <ion-button class=" copy" @click="copyAddress">
                <ion-icon :icon="copyOutline"></ion-icon>
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>



        <!-- Third-Party Tokens -->
        <ion-card class="tokens-card b-all">
          <ion-card-header class="card-header">
            <ion-card-title class="text-pri text-bold cfont">Your Balance</ion-card-title>
            <hr>
          </ion-card-header>

          <ion-card-content>
            <ion-list v-for="(token, index) in coinVal" :key="index">
              <ion-item>
                <ion-label>
                  <span class="text-pri text-bold">{{ token.name }}</span>

                  <div class="space-between">
                    <span class="text-pri text-bold">{{ token.balance }} ${{ token.symbol }} </span>
                    <span class="text-muted text-bold"> ${{ token.value }} <br><small> ${{ token.coinValue }}
                      </small></span>
                  </div>

                </ion-label>

              </ion-item>
              <hr>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <!-- Transactions History -->
        <ion-card class="transactions-card">
          <ion-card-header class="card-header">
            <ion-card-title>Transaction History</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item v-for="(tx, index) in transactions" :key="index">
                <ion-label>
                  <h3>{{ tx.type === 'send' ? 'Sent' : 'Received' }} {{ tx.amount }} GLX</h3>
                  <p>{{ tx.address }}</p>
                  <p class="date">{{ tx.date }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>


      </div>

      <!-- Send Modal -->
      <ion-modal :is-open="sendModalOpen" @didDismiss="closeSendModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Send GLX</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeSendModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="modal-content">
          <ion-item>
            <ion-input v-model="recipient" placeholder="Recipient Address"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="amount" type="number" placeholder="Amount"></ion-input>
          </ion-item>
          <ion-button class="py-2 px-4 round bg-blue  " size="default" shape="round" expand="full"
            @click="sendGLX">Send</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Receive Modal -->
      <ion-modal :is-open="receiveModalOpen" @didDismiss="closeReceiveModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Receive GLX</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeReceiveModal">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="modal-content">
          <span :value="walletAddress" size="200" class="qr-code"></span>
          <ion-button class="copy-btn" @click="copyAddress">
            <ion-icon :icon="copyOutline"></ion-icon>
          </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader,
  IonCardTitle, IonButton, IonModal, IonItem, IonInput, IonList, IonLabel, IonButtons, IonIcon
} from '@ionic/vue';
import { paperPlaneOutline, qrCodeOutline, copyOutline } from 'ionicons/icons';
//import QrcodeVue from 'qrcode.vue';
import { ref, computed } from "vue";
import headerContent from '@/components/headerContent.vue';

//const tokensVal = ref(0);
const walletAddress = ref("GLX1234567890abcdef");
const sendModalOpen = ref(false);
const receiveModalOpen = ref(false);
const recipient = ref("");
const amount = ref<number | null>(null);


const transactions = ref([
  { type: "send", amount: 50, address: "GLXabc123", date: "March 20, 2025" },
  { type: "receive", amount: 120, address: "GLXxyz456", date: "March 19, 2025" }
]);

const tokens = ref([
  { name: "Gloxx", symbol: "Glx", balance: 1000, value: 1 },
  { name: "GloxxPay", symbol: "GPAY", balance: 500, value: 0.25 },
  { name: "G-Stable", symbol: "GSTB", balance: 2500, value: 0.6 }
]);

const coinVal = computed(() => {
  return tokens.value.map(token => ({
    name: token.name,
    symbol: token.symbol,
    balance: token.balance,
    value: token.value,

    coinValue: token.balance * token.value,
  }));
});
const tokensVal = computed(() =>
  tokens.value.reduce((total, token) => total + token.balance * token.value, 0)
);




const openSendModal = () => {
  sendModalOpen.value = true;
};
const closeSendModal = () => {
  sendModalOpen.value = false;
};
const openReceiveModal = () => {
  receiveModalOpen.value = true;
};
const closeReceiveModal = () => {
  receiveModalOpen.value = false;


};

const copyAddress = () => {
  navigator.clipboard.writeText(walletAddress.value);
  alert("Wallet address copied!");
};
const sendGLX = () => {
  if (!recipient.value || !amount.value || amount.value <= 0) {
    alert("Please enter a valid recipient and amount.");
    return;
  };

  alert(`Sent ${amount.value} GLX to ${recipient.value} `);
  transactions.value.unshift({
    type: "send",
    amount: amount.value,
    address: recipient.value,
    date: new Date().toDateString()
  });

  sendModalOpen.value = false;
  recipient.value = "";
  amount.value = null;


}
</script>

<style scoped>
/* Wallet Balance */
.balance-card {
  text-align: center;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(168, 11, 147, 0.2);
}

.balance-card h1 {
  font-size: 2.5em;
  margin: 10px 0;
}

.wallet-address {
  font-size: 0.9em;
  opacity: 0.7;
}

/* Action Buttons */
.actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}



/* Transactions & Tokens */
.transactions-card,
.tokens-card {
  margin-top: 20px;
}

.transactions-card h3,
.tokens-card h3 {
  font-size: 1.1em;
}

ion-modal {
  --height: 50%;
  --border-radius: 16px;
}

.date {
  font-size: 0.8em;
  opacity: 0.7;
}

/* QR Code */
.qr-code {
  margin: 20px auto;
  border: 8px solid white;
  border-radius: 10px;
}

/* Copy Button */
.copy-btn {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: auto;
}
</style>
