<template>
  <ion-page>
    <ion-header class="gradient-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" :icon="arrowBackOutline"></ion-back-button>
        </ion-buttons>
        <ion-title>Glx Explorer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Token Statistics Card -->
      <ion-card>
        <ion-card-header class="card-header">
          <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">GLX Token Info</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <div class="stat-item">
                  <div class="stat-label">Price (USD)</div>
                  <div class="stat-value">${{ tokenStats.price }}</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="stat-item">
                  <div class="stat-label">Market Cap</div>
                  <div class="stat-value">${{ tokenStats.marketCap }}M</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="stat-item">
                  <div class="stat-label">Total Supply</div>
                  <div class="stat-value">{{ tokenStats.totalSupply }}M GLX</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="stat-item">
                  <div class="stat-label">Circulating Supply</div>
                  <div class="stat-value">{{ tokenStats.circulatingSupply }}M GLX</div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Network Activity Chart -->
      <ion-card class="chart-card">
        <ion-card-header class="card-header">
          <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">Network Activity</ion-card-title>
          <ion-segment v-model="chartTimeframe">
            <ion-segment-button value="24h">24H</ion-segment-button>
            <ion-segment-button value="7d">7D</ion-segment-button>
            <ion-segment-button value="30d">30D</ion-segment-button>
          </ion-segment>
        </ion-card-header>
        <ion-card-content>
          <canvas ref="txChart"></canvas>
        </ion-card-content>
      </ion-card>

      <!-- Search Bar -->
      <div class="search-container ion-padding">
        <ion-searchbar
          placeholder="Search by Address / Txn Hash / Block"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        ></ion-searchbar>
      </div>

      <!-- Network Stats -->
      <ion-card>
        <ion-card-header class="card-header">
          <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">Network Statistics</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <div class="stat-item">
                  <div class="stat-label">Latest Block</div>
                  <div class="stat-value">{{ networkStats.latestBlock }}</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="stat-item">
                  <div class="stat-label">Transactions</div>
                  <div class="stat-value">{{ networkStats.totalTransactions }}</div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Latest Blocks -->
      <ion-card>
        <ion-card-header class="card-header">
          <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">Latest Blocks</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="block in latestBlocks" :key="block.number">
              <ion-label>
                <h2>Block #{{ block.number }}</h2>
                <p>Miner: {{ block.miner }}</p>
                <p>Transactions: {{ block.txCount }}</p>
              </ion-label>
              <ion-note slot="end">{{ block.timestamp }}</ion-note>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Latest Transactions -->
      <ion-card>
        <ion-card-header class="card-header">
          <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">Latest Transactions</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="tx in latestTransactions" :key="tx.hash">
              <ion-label>
                <h2>{{ formatHash(tx.hash) }}</h2>
                <p>From: {{ formatHash(tx.from) }}</p>
                <p>To: {{ formatHash(tx.to) }}</p>
              </ion-label>
              <ion-note slot="end">{{ tx.value }} GC</ion-note>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Validators List -->
      <ion-card>
        <ion-card-header class="card-header">
          <ion-card-title class="text-bold text-light text-sm sm:text-base md:text-lg">Active Validators</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item v-for="validator in validators" :key="validator.address">
              <ion-label>
                <h2>{{ formatHash(validator.address) }}</h2>
                <p>Staked: {{ validator.staked }} GLX</p>
              </ion-label>
              <ion-badge slot="end" :color="validator.active ? 'success' : 'medium'">
                {{ validator.active ? 'Active' : 'Inactive' }}
              </ion-badge>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

    </ion-content>

    <!-- Floating Action Button -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button>
        <ion-icon :icon="gridOutline"></ion-icon>
      </ion-fab-button>
      <ion-fab-list side="top">
        <ion-fab-button @click="refreshData">
          <ion-icon :icon="refreshOutline"></ion-icon>
        </ion-fab-button>
        <ion-fab-button @click="shareExplorer">
          <ion-icon :icon="shareOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab-list>
    </ion-fab>
    
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonFab,
  IonFabButton,
  IonFabList,
  IonBadge,
  IonIcon,
  IonBackButton,
  IonButtons
} from '@ionic/vue';
import { gridOutline, refreshOutline, shareOutline, arrowBackOutline } from 'ionicons/icons';
import { Chart } from 'chart.js/auto';

const searchQuery = ref('');
const networkStats = ref({
  latestBlock: '12,345,678',
  totalTransactions: '45,678,901'
});

const latestBlocks = ref([
  {
    number: '12345678',
    miner: '0x1234...5678',
    txCount: 150,
    timestamp: '2 mins ago'
  },
  // Add more mock data as needed
]);

const latestTransactions = ref([
  {
    hash: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0xabcdef1234567890abcdef1234567890abcdef12',
    value: '100'
  },
  // Add more mock data as needed
]);

const tokenStats = ref({
  price: '0.0521',
  marketCap: '52.1',
  totalSupply: '1000',
  circulatingSupply: '750'
});

const validators = ref([
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    staked: '100000',
    active: true
  }
]);

const chartTimeframe = ref('24h');
const txChart = ref(null);

const handleSearch = () => {
  // Implement search functionality
  //console.log('Searching for:', searchQuery.value);
};

const formatHash = (hash: string) => {
  return hash.substring(0, 6) + '...' + hash.substring(hash.length - 4);
};

const initChart = () => {
  if (txChart.value) {
    new Chart(txChart.value, {
      type: 'line',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: 'Transactions',
          data: [65, 59, 80, 81, 56, 55],
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true
      }
    });
  }
};

const refreshData = () => {
  // Implement refresh logic
};

const shareExplorer = () => {
  // Implement share functionality
};

onMounted(() => {
  initChart();
});
</script>

<style scoped>
.search-container {
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-label {
  color: var(--ion-color-medium);
  font-size: 0.9em;
}

.stat-value {
  font-size: 1.2em;
  font-weight: bold;
  color: var(--ion-color-primary);
}

ion-card {
  margin: 1rem;
}

ion-note {
  font-size: 0.8em;
}

.gradient-header ion-toolbar {
  --background: var(--gradient-primary);
  --color: white;
}

.chart-card {
  height: 300px;
}

ion-segment {
  margin-top: 10px;
}

ion-fab {
  margin-bottom: 20px;
  margin-right: 20px;
}
</style>
